"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Loader2, LogIn, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { EventWithParticipantsAndCounts } from "@/types";
import { PendingApprovalModal } from "./PendingApprovalModal";

import { logError } from "@/lib/sentry";
import { leaveEvent } from "@/app/[locale]/actions/events/participant/leaveEvent";
import { joinEvent } from "@/app/[locale]/actions/events/participant/joinEvent";
import { PhoneNumberModal } from "./PhoneNumberModal";
import EventTicketModal from "@/app/[locale]/(root)/events/_components/EventTicketModal";
import { useTranslations } from "next-intl";
import { usePostHog } from "posthog-js/react";

interface JoinEventButtonProps {
  event: EventWithParticipantsAndCounts;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
  phone?: string;
}

export function JoinEventButton({
  className,
  event,
  size = "default",
  variant = "default",
  disabled = false,
  phone,
}: JoinEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [qrUrl, setQrurl] = useState("");
  const [openAprovalModal, setOpenAprovalModal] = useState(false);
  const { isAuthenticated, getUser } = useKindeBrowserClient();
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const url = usePathname();
  const id = getUser()?.id;
  const t = useTranslations("events.joinButton");
  const posthog = usePostHog();

  const maxCapacity = event.capacity;
  const eventId = event.id;
  const participantCount = event.participants?.length;
  const isFull = maxCapacity ? participantCount >= maxCapacity : false;
  const owner = event.organizerId === id;
  const joined =
    id &&
    Array.isArray(event.participants) &&
    event.participants.some((p) => p.participantId === id);

  const isDisabled = disabled || (isFull && !joined) || owner;

  async function handleLeaveEvent() {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      const res = await leaveEvent?.(eventId);
      if (res.success) {
        toast.success(res.message);
        posthog.capture("event_left", {
          event_id: event.id,
          event_name: event.title,
          source: "event_detail_page",
        });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      logError(err, { eventId, userId: id });
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJoinEvent() {
    if (isDisabled || isLoading) return;

    setIsLoading(true);
    try {
      const res = await joinEvent(eventId);
      if (res.success) {
        toast.success(res.message);
        if (!event.isFree) {
          setOpenAprovalModal(true);
          posthog.capture("event_joined_paid", {
            event_id: event.id,
            event_name: event.title,
            source: "event_detail_page",
          });
        } else {
          setQrurl(res?.data?.qrDataUrl!);
          setOpenTicketModal(true);
          posthog.capture("event_joined_free", {
            event_id: event.id,
            event_name: event.title,
            source: "event_detail_page",
          });
        }
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      logError(err, { eventId, userId: id });
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleJoinOrLeaveEvent() {
    if (joined) {
      handleLeaveEvent();
    } else {
      handleJoinEvent();
    }
  }

  function getButtonText() {
    if (isLoading)
      return joined ? t("button.loading.leaving") : t("button.loading.joining");
    if (joined) return t("button.text.leaveEvent");
    if (isFull) return t("button.text.eventFull");
    return t("button.text.joinEvent");
  }

  function getButtonVariant() {
    if (joined) return "outline";
    return variant;
  }

  function handleAccessCheck() {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    // If user is leaving, skip phone check
    if (joined) {
      handleLeaveEvent();
      return;
    }

    // Check if user has a phone number only when joining
    if (!phone) {
      setOpenPhoneModal(true);
      return;
    }

    handleJoinOrLeaveEvent();
  }

  function handlePhoneSuccess() {
    // After phone number is added, proceed with joining the event
    handleJoinOrLeaveEvent();
  }

  return (
    <>
      <Button
        onClick={handleAccessCheck}
        disabled={isDisabled || isLoading}
        variant={getButtonVariant()}
        size={size}
        className={cn(
          "relative overflow-hidden transition-all p-6  duration-300 group",
          // Default styling
          !joined && !isDisabled && "hover:scale-[1.02] active:scale-[0.98]",
          // Joined state
          joined && "!bg-primary lg:!bg-white border hover:!text-foreground",
          // Full state
          isFull && " disabled:bg-accent/80 disabled:cursor-not-allowed",
          // Loading state
          isLoading && "cursor-wait",
          className
        )}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : joined ? (
            <Check className="w-4 h-4" />
          ) : (
            <Users className="w-4 h-4 " />
          )}
          <span className="font-medium">{getButtonText()}</span>

          {participantCount > 0 && (
            <span className="text-xs opacity-75">
              ({participantCount} {maxCapacity ? `/${maxCapacity}` : ""})
            </span>
          )}

          {/* Subtle animation overlay */}
          {!joined && !isDisabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          )}
        </div>
      </Button>

      {/* Pending Approval Modal */}
      <PendingApprovalModal
        open={openAprovalModal}
        setOpen={setOpenAprovalModal}
        title={t("approveModal.title")}
        description={t("approveModal.description")}
        phoneNumber={event.contactPhone}
        eventTitle={event.title}
      />
      <EventTicketModal
        title={event.title}
        startTime={event.startTime}
        endTime={event.endTime}
        qrUrl={qrUrl}
        open={openTicketModal}
        setOpen={setOpenTicketModal}
      />

      {/* Phone Number Modal */}
      <PhoneNumberModal
        open={openPhoneModal}
        setOpen={setOpenPhoneModal}
        onSuccess={handlePhoneSuccess}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}</DialogTitle>
            <DialogDescription>{t("dialog.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("dialog.button.cancel")}</Button>
            </DialogClose>
            <Button asChild>
              <LoginLink postLoginRedirectURL={url}>
                <LogIn />
                Login
              </LoginLink>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
