"use client";

import { verifyTicket } from "@/lib/actions";
import { getErrorMessage } from "@/lib/utils";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export default function ScanPage() {
  const [feedback, setFeedback] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const handleScan = async (codes: { rawValue: string; format: string }[]) => {
    if (!codes || codes.length === 0) return;

    const code = codes[0].rawValue;

    if (code === lastScannedCode) return; // avoid double scan
    setLastScannedCode(code);

    try {
      const res = await verifyTicket(code);

      if (res.success) {
        setFeedback({ message: `✅ Ticket verified: ${code}`, success: true });
      } else {
        setFeedback({ message: `❌ Something went wrong`, success: false });
      }
    } catch (err) {
      setFeedback({ message: getErrorMessage(err), success: false });
      console.error(err);
    }

    // Reset after 3 seconds to allow next scan
    setTimeout(() => setLastScannedCode(null), 3000);
  };

  const handleError = (error: any) => {
    console.error(error);
    setFeedback({
      message: "❌ Camera error. Please allow camera access.",
      success: false,
    });
  };

  return (
    <div className=" h-[100%-80px] w-[350px] p-6  mx-auto flex flex-col items-center justify-center bg-card border text-foreground">
      <h1 className="text-3xl font-bold mb-6">Scan Event QR code</h1>

      <div className="relative w-80 h-96 rounded-xl overflow-hidden border-2  shadow-lg">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ facingMode: "environment" }}
        />
      </div>

      {feedback && (
        <div
          className={`mt-6 px-6 py-3 rounded-xs font-semibold ${
            feedback.success
              ? "bg-green-500"
              : "bg-destructive/30 text-destructive/50"
          } shadow-lg `}
        >
          {feedback.message}
        </div>
      )}

      <p className="mt-4 text-sm opacity-80">
        Point your camera at the attendee QR code
      </p>
    </div>
  );
}
