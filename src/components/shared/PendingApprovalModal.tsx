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
import { X } from "lucide-react";

interface PendingApprovalModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}

export function PendingApprovalModal({
  open,
  setOpen,
  title,
  description,
  action,
  actionLabel = "Withdraw",
}: PendingApprovalModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Close
            </Button>
          </DialogClose>
          {action && actionLabel && (
            <Button
              onClick={action}
              variant="ghost"
              className="flex-1 flex items-center justify-center gap-1 text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900"
            >
              <X className="w-4 h-4" /> {actionLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
