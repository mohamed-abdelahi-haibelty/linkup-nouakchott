"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { X, MessageCircle } from "lucide-react";

interface PendingApprovalModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  phoneNumber?: string | null;
  eventTitle?: string;
}

export function PendingApprovalModal({
  open,
  setOpen,
  title,
  description,
  action,
  actionLabel = "Withdraw",
  phoneNumber,
  eventTitle,
}: PendingApprovalModalProps) {
  function handleContactOrganizer() {
    if (!phoneNumber) return;

    // Remove any non-digit characters except + at the start
    let cleanPhone = phoneNumber.trim().replace(/[^\d+]/g, "");

    // Check if phone starts with country code
    if (!cleanPhone.startsWith("+")) {
      alert(
        "Unable to contact organizer: Phone number must include country code (e.g., +222 for Mauritania, +212 for Morocco)."
      );
      return;
    }

    // Validate minimum length
    if (cleanPhone.length < 10) {
      alert(
        "Unable to contact organizer: Phone number appears to be incomplete."
      );
      return;
    }

    // Create a pre-filled message
    const message = eventTitle
      ? `Hi! I just submitted a request to join "${eventTitle}".`
      : `Hi! I just submitted a request to join your event. `;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Open in new tab
    window.open(whatsappUrl, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {phoneNumber && (
            <Button
              onClick={handleContactOrganizer}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Organizer
            </Button>
          )}
          {action && actionLabel && (
            <Button
              onClick={action}
              variant="ghost"
              className="flex-1 flex items-center justify-center gap-1 text-red-500 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900"
            >
              <X className="w-4 h-4" /> {actionLabel}
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
