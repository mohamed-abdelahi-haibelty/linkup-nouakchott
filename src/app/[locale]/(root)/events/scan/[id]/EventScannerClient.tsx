"use client";
import { verifyEventTicket } from "@/app/[locale]/actions/events/ticket/verifyEventTicket";
import { Button } from "@/components/ui/button";
import { logError } from "@/lib/sentry";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Pause, Repeat, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface EventScannerClientProps {
  eventId: string;
  eventTitle: string;
  eventStartTime: Date;
  eventEndTime: Date;
}

export default function EventScannerClient({
  eventId,
  eventTitle,
  eventStartTime,
  eventEndTime,
}: EventScannerClientProps) {
  const [feedback, setFeedback] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const [isPaused, setIsPaused] = useState(false);

  const handleScan = async (codes: { rawValue: string; format: string }[]) => {
    if (isProcessing || !codes || codes.length === 0) return;

    let code: string | null = null;

    try {
      const url = new URL(codes[0].rawValue);
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (pathParts.length >= 2 && pathParts[0] === "checkin") {
        code = pathParts[1];
      } else {
        setFeedback({
          message: "❌ Invalid QR code. Please scan a valid ticket.",
          success: false,
        });
        return;
      }
    } catch (error) {
      setFeedback({
        message: "❌ Invalid QR code format.",
        success: false,
      });
      return;
    }

    if (code === lastScannedCode) return; // avoid double scan
    setLastScannedCode(code);
    setIsProcessing(true);

    try {
      const res = await verifyEventTicket(code, eventId);

      if (res.success) {
        setFeedback({ message: res.message, success: true });
      } else {
        setFeedback({ message: res.message, success: false });
      }
    } catch (err) {
      logError(err, { scannedCode: code, eventId });
      setFeedback({
        message: "❌ Unexpected error. Please try again.",
        success: false,
      });
    }

    // Reset after 3 seconds to allow next scan
    setIsProcessing(false);
    setTimeout(() => {
      setLastScannedCode(null);
      setFeedback(null);
    }, 3000);
  };

  const handleError = (error: any) => {
    console.error(error);
    logError(error, { context: "QRScanner", eventId });
    setFeedback({
      message: "❌ Camera error. Please allow camera access.",
      success: false,
    });
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused) {
      setFeedback({ message: "⏸️ Scanner paused", success: false });
    } else {
      setFeedback(null);
    }
  };

  return (
    <div className="h-[calc(100%-80px)] lg:min-h-screen w-full p-4 md:p-6 mx-auto flex flex-col items-center bg-card lg:bg-background border lg:border-none rounded-lg text-foreground">
      {/* Header */}
      <div className="mb-6 text-center w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/events/${eventId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Event Check-In</h1>
        <p className="text-lg font-semibold text-primary mb-1">{eventTitle}</p>
        <p className="text-sm text-muted-foreground">
          Scan attendee QR codes to verify tickets
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(eventStartTime).toLocaleDateString()} •{" "}
          {new Date(eventStartTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Scanner */}
      <div className="relative w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-black">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ facingMode, advanced: [{ torch: torchOn }] as any }}
          styles={{
            container: { width: "100%", height: "100%" },
            video: { objectFit: "cover", width: "100%", height: "100%" },
          }}
          components={{
            finder: false,
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
            <p className="text-white font-medium text-lg mt-4">Verifying...</p>
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
          <Button
            size="icon"
            onClick={() => setTorchOn(!torchOn)}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
            title={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
          >
            {torchOn ? "🔦" : "💡"}
          </Button>

          <Button
            size="icon"
            onClick={togglePause}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
            title={isPaused ? "Resume scanning" : "Pause scanning"}
          >
            {isPaused ? "▶️" : <Pause />}
          </Button>

          <Button
            size="icon"
            onClick={() =>
              setFacingMode((prev) =>
                prev === "environment" ? "user" : "environment"
              )
            }
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
            title="Switch camera"
          >
            <Repeat />
          </Button>
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mt-6 px-6 py-4 rounded-lg font-semibold text-white text-center shadow-lg ${
            feedback.success ? "bg-accent/60" : "bg-destructive/70"
          }`}
        >
          <p>{feedback.message}</p>
          {lastScannedCode && (
            <p className="text-xs font-mono mt-1 opacity-80">
              {lastScannedCode}
            </p>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 text-center text-sm text-muted-foreground space-y-1">
        <p>💡 Tip: Position the QR code within the frame</p>
        <p className="text-xs">Only tickets for this event will be accepted</p>
      </div>

      {/* Required CSS animation */}
      <style jsx>{`
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

        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
