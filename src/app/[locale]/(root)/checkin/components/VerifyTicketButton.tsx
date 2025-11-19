"use client";

import { useState } from "react";
import { verifyTicket } from "@/app/[locale]/actions/events/ticket/verifyTicket";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
      const result = await verifyTicket(code);

      if (result.success) {
        toast.success(result.message);
        // Refresh the page to show updated status
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
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
