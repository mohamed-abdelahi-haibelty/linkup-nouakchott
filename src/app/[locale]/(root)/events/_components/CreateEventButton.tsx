"use client";
import { useAppSession } from "@/lib/use-app-session";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActionTooltip from "@/components/shared/ActionTooltip";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { LogIn, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { usePostHog } from "posthog-js/react";
function CreateEventButton() {
  const { isAuthenticated } = useAppSession();
  const t = useTranslations("events.components.createEventButton");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const posthog = usePostHog();

  function handleAcessCheck() {
    posthog.capture("event_create_click");
    if (isAuthenticated) {
      router.push("/events/create");
    } else {
      setOpen(true);
    }
  }

  return (
    <>
      <Button
        className=" md:hidden bg-accent hover:shadow-xl transition-all duration-300 gap-2 font-semibold"
        size="default"
        onClick={handleAcessCheck}
      >
        <Plus className="h-4 w-4" />
        {t(`button.create.text`)}
      </Button>

      <ActionTooltip label={t("button.tooltip.label")}>
        <Button
          onClick={handleAcessCheck}
          className="bg-white border hidden md:block rounded-sm   shadow-[4px_4px_0px_0px_hsl(0_0%_0%_/_1)]"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </ActionTooltip>

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
              <LoginLink postLoginRedirectURL="/events/create">
                <LogIn />
                {t("dialog.button.login")}
              </LoginLink>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateEventButton;
