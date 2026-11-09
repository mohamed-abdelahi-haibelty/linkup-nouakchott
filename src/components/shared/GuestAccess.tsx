"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAppSession } from "@/lib/use-app-session";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
const copy = {
  en: [
    "Try as a guest",
    "Guest access lasts 24 hours. Activity stays in this session and does not transfer when you sign in.",
    "Guest session · expires after 24 hours",
    "End guest session",
    "Sign in",
    "Unable to start guest access. Please try again later.",
  ],
  fr: [
    "Essayer en tant qu’invité",
    "L’accès invité dure 24 heures. Votre activité reste dans cette session et n’est pas transférée à la connexion.",
    "Session invitée · expire après 24 heures",
    "Quitter la session invitée",
    "Se connecter",
    "Impossible de démarrer la session. Réessayez plus tard.",
  ],
  ar: [
    "جرّب كضيف",
    "وصول الضيف صالح لمدة 24 ساعة. يبقى نشاطك في هذه الجلسة ولا ينتقل عند تسجيل الدخول.",
    "جلسة ضيف · تنتهي بعد 24 ساعة",
    "إنهاء جلسة الضيف",
    "تسجيل الدخول",
    "تعذر بدء جلسة الضيف. حاول لاحقًا.",
  ],
};
export default function GuestAccess() {
  const locale = useLocale();
  const t = copy[locale as keyof typeof copy] || copy.en;
  const session = useAppSession();
  const [busy, setBusy] = useState(false);
  async function startOrEnd() {
    setBusy(true);
    try {
      const response = await fetch("/api/guest", {
        method: session.isGuest ? "DELETE" : "POST",
      });
      if (!response.ok) throw new Error();
      if (session.isGuest)
        window.location.replace(
          new URL(`/${locale}/events`, window.location.origin).href,
        );
      else window.location.reload();
    } catch {
      toast.error(t[5]);
      setBusy(false);
    }
  }
  if (session.isLoading || (session.isAuthenticated && !session.isGuest))
    return null;
  return (
    <aside
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/40 p-4"
      aria-label={t[0]}
    >
      <p className="text-sm text-muted-foreground">
        {session.isGuest ? t[2] : t[1]}
      </p>
      <div className="flex items-center gap-3">
        {session.isGuest && (
          <LoginLink>
            <Button variant="outline">{t[4]}</Button>
          </LoginLink>
        )}
        <Button
          variant={session.isGuest ? "outline" : "default"}
          disabled={busy}
          onClick={startOrEnd}
        >
          {busy ? "…" : session.isGuest ? t[3] : t[0]}
        </Button>
      </div>
    </aside>
  );
}
