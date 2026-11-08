"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventTicket } from "@/features/events/components/EventTicket";
import { EventTicketProps } from "@/types/index";
import html2canvas from "html2canvas-pro";
import { Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = EventTicketProps & {
  open: boolean;
  setOpen: (open: boolean) => void;
};

function EventTicketModal({
  title,
  startTime,
  endTime,
  qrUrl,
  open,
  setOpen,
}: Props) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#000",
      });

      const link = document.createElement("a");
      link.download = `${title}-ticket.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast("Ticket downloaded 🎟️", {
        description: "Your ticket image has been saved successfully.",
      });
    } catch (error) {
      console.error("Error generating ticket:", error);
      toast("Download failed", {
        description: "Something went wrong while generating your ticket.",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ticket</DialogTitle>
          <div ref={ticketRef}>
            <EventTicket
              title={title}
              startTime={startTime}
              endTime={endTime}
              qrUrl={qrUrl}
            />
          </div>
        </DialogHeader>
        <DialogFooter className="flex justify-between gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-x-2 items-center"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <span>Download Ticket</span>
                <Download className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EventTicketModal;
