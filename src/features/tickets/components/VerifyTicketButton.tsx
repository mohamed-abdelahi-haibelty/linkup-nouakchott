"use client";

import { Button } from "@/components/ui/button";
import { verifyTicket } from "@/features/tickets/actions/verifyTicket";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyTicketButtonProps {
  code: string;
  canVerify: boolean;
  eventId: string;
}

export default function VerifyTicketButton({
  code,
  canVerify,
  eventId,
}: VerifyTicketButtonProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!canVerify) return;

    setIsVerifying(true);
    try {
      const result = await verifyTicket(code, eventId);

      if (result.success) {
        toast.success(result.message);
        // Refresh the page to show updated status
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to verify ticket. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Button
      onClick={handleVerify}
      disabled={!canVerify || isVerifying}
      className="w-full"
      size="lg"
    >
      {isVerifying ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Verifying...
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" />
          {canVerify ? "Verify Ticket" : "Cannot Verify"}
        </>
      )}
    </Button>
  );
}
