"use client";

import { verifyTicket } from "@/lib/actions";
import { logError } from "@/lib/sentry";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState, useEffect, useRef } from "react";
import { boolean } from "zod";

export default function ScanPage() {
  const [feedback, setFeedback] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanCount, setScanCount] = useState({ success: 0, failed: 0 });
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scanHistory, setScanHistory] = useState<
    Array<{
      code: string;
      success: boolean;
      timestamp: Date;
    }>
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sound feedback
  const playSound = (success: boolean) => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (success) {
        // Success: pleasant double beep
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);

        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 1000;
          gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1
          );
          osc2.start(audioContext.currentTime);
          osc2.stop(audioContext.currentTime + 0.1);
        }, 100);
      } else {
        // Error: lower pitch buzz
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  // Haptic feedback
  const vibrate = (success: boolean) => {
    if (navigator.vibrate) {
      navigator.vibrate(success ? [50, 50, 50] : [200, 100, 200]);
    }
  };

  const handleScan = async (codes: { rawValue: string; format: string }[]) => {
    if (isProcessing || isPaused || !codes || codes.length === 0) return;

    let code: string | null = null;

    try {
      const url = new URL(codes[0].rawValue);
      const pathParts = url.pathname.split("/").filter(boolean);
      console.log("pathparts_", pathParts);

      if (pathParts.length >= 2 && pathParts[0] === "checkin") {
        code = pathParts[1];
      } else {
        setFeedback({
          message: "❌ Invalid QR code format. Please scan a valid ticket.",
          success: false,
        });
        playSound(false);
        vibrate(false);
        return;
      }
    } catch (error) {
      setFeedback({
        message: "❌ Invalid QR code. Not a valid URL.",
        success: false,
      });
      playSound(false);
      vibrate(false);
      return;
    }

    console.log(code);

    if (code === lastScannedCode) return; // avoid double scan

    setLastScannedCode(code);
    setIsProcessing(true);

    try {
      const res = await verifyTicket(code);

      if (res.success) {
        setFeedback({
          message: `✅ Ticket verified successfully!`,
          success: true,
        });
        setScanCount((prev) => ({ ...prev, success: prev.success + 1 }));
        playSound(true);
        vibrate(true);
        setScanHistory((prev) => [
          { code, success: true, timestamp: new Date() },
          ...prev.slice(0, 19), // Keep last 20
        ]);
      } else {
        setFeedback({
          message: res.message || "❌ Ticket verification failed",
          success: false,
        });
        setScanCount((prev) => ({ ...prev, failed: prev.failed + 1 }));
        playSound(false);
        vibrate(false);
        setScanHistory((prev) => [
          { code, success: false, timestamp: new Date() },
          ...prev.slice(0, 19),
        ]);
      }
    } catch (err) {
      logError(err, { scannedCode: code });
      setFeedback({
        message: "❌ Network error. Please check connection and try again.",
        success: false,
      });
      setScanCount((prev) => ({ ...prev, failed: prev.failed + 1 }));
      playSound(false);
      vibrate(false);
    }

    setIsProcessing(false);

    // Clear previous timeout
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    // Auto-dismiss feedback after 3 seconds
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      setLastScannedCode(null);
    }, 3000);
  };

  const handleError = (error: any) => {
    console.error(error);
    logError(error, { context: "QRScanner" });

    let errorMsg = "❌ Camera error: ";

    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      errorMsg +=
        "Camera permission denied. Please allow camera access in your browser settings.";
    } else if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      errorMsg += "No camera found on this device.";
    } else if (
      error.name === "NotReadableError" ||
      error.name === "TrackStartError"
    ) {
      errorMsg += "Camera is already in use by another application.";
    } else {
      errorMsg += "Please try refreshing the page.";
    }

    setCameraError(errorMsg);
  };

  const handleReset = () => {
    setFeedback(null);
    setLastScannedCode(null);
    setIsProcessing(false);
    setCameraError(null);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Clear all scan history?")) {
      setScanHistory([]);
      setScanCount({ success: 0, failed: 0 });
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused) {
      setFeedback({ message: "⏸️ Scanner paused", success: false });
    } else {
      setFeedback(null);
    }
  };

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full p-4 md:p-6 mx-auto flex flex-col items-center bg-background text-foreground">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Event Check-In
          </h1>
          <p className="text-sm text-muted-foreground">
            Scan attendee QR codes to verify tickets
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {scanCount.success}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Verified</div>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {scanCount.failed}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Failed</div>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {scanCount.success + scanCount.failed}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total</div>
          </div>
        </div>

        {/* Camera Error Message */}
        {cameraError && (
          <div className="mb-4 p-4 bg-destructive/20 border border-destructive rounded-lg">
            <p className="text-sm text-destructive font-medium">
              {cameraError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs underline text-destructive hover:text-destructive/80"
            >
              Refresh page
            </button>
          </div>
        )}

        {/* Scanner Container */}
        <div className="relative w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-black">
          <Scanner
            onScan={handleScan}
            onError={handleError}
            paused={isPaused}
            constraints={{
              facingMode,
              advanced: [{ torch: torchOn }] as any,
            }}
            styles={{
              container: { width: "100%", height: "100%" },
              video: { objectFit: "cover", width: "100%", height: "100%" },
            }}
            components={{
              finder: false, // Disable the default finder overlay completely
            }}
          />

          {/* Scanning Frame Overlay */}
          {!isPaused && !isProcessing && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-64 h-64 border-2 border-primary/50 rounded-lg">
                {/* Animated scanning line */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-primary animate-scan-line" />

                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
            </div>
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
              <p className="text-white font-medium text-lg mt-4">
                Verifying...
              </p>
            </div>
          )}

          {/* Paused Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">⏸️</div>
                <p className="text-white font-medium text-lg">Scanner Paused</p>
              </div>
            </div>
          )}

          {/* Camera Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <button
              onClick={() => setTorchOn(!torchOn)}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
              title={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
            >
              {torchOn ? "🔦" : "💡"}
            </button>

            <button
              onClick={togglePause}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
              title={isPaused ? "Resume scanning" : "Pause scanning"}
            >
              {isPaused ? "▶️" : "⏸️"}
            </button>

            <button
              onClick={() =>
                setFacingMode((prev) =>
                  prev === "environment" ? "user" : "environment"
                )
              }
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
              title="Switch camera"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="mt-6 relative">
            <div
              className={`px-6 py-4 rounded-lg font-semibold text-center shadow-lg transition-all ${
                feedback.success
                  ? "bg-green-500 text-white"
                  : "bg-destructive/90 text-white"
              }`}
            >
              <p className="text-lg">{feedback.message}</p>
              {lastScannedCode && (
                <p className="text-sm opacity-90 mt-1 font-mono">
                  {lastScannedCode}
                </p>
              )}

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
                <div className="h-full bg-white/60 animate-shrink-width" />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-card hover:bg-accent border rounded-lg font-medium transition-colors"
          >
            🔄 Clear & Reset
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-3 bg-card hover:bg-accent border rounded-lg font-medium transition-colors"
          >
            📋 {showHistory ? "Hide" : "Show"} History
          </button>
        </div>

        {/* Scan History */}
        {showHistory && (
          <div className="mt-6 bg-card border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Scan History</h2>
              {scanHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-destructive hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No scans yet. Start scanning tickets!
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {scanHistory.map((scan, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                      scan.success ? "bg-green-500/10" : "bg-destructive/10"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs truncate">{scan.code}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {scan.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="ml-3 text-lg">
                      {scan.success ? "✅" : "❌"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-muted-foreground space-y-1">
          <p>💡 Tip: Position the QR code within the frame</p>
          <p>🔊 Audio feedback enabled</p>
        </div>
      </div>

      {/* Add required CSS animation */}
      <style jsx>{`
        @keyframes shrink-width {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes scan-line {
          0%,
          100% {
            top: 0;
            opacity: 0;
          }
          50% {
            top: 100%;
            opacity: 1;
          }
        }

        .animate-shrink-width {
          animation: shrink-width 3s linear;
        }

        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
