"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { updateUserPhone } from "@/app/[locale]/actions/user/updateUserPhone";
import { logError } from "@/lib/sentry";

interface PhoneNumberModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PhoneNumberModal({
  open,
  setOpen,
  onSuccess,
}: PhoneNumberModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateUserPhone(phoneNumber);

      if (res.success) {
        toast.success(res.message);
        setOpen(false);
        setPhoneNumber("");
        onSuccess?.();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      logError(err, { phoneNumber });
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Phone Number Required
          </DialogTitle>
          <DialogDescription>
            Please add your phone number to join this event. The organizer will
            use this to contact you regarding event details and confirmations.
            <strong className="block mt-2 text-foreground">
              Include country code (e.g., +222, +212, +1)
            </strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+222 27138997"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Must include country code. Examples: +222 (Mauritania), +212
                (Morocco), +1 (USA)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
