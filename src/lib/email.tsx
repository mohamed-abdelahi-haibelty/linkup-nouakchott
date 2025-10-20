//lib/email.tsx
"use server";

import { Resend } from "resend";
import TicketEmail from "@/app/emails/TicketEmail";

export async function sendTicketEmail(
  email: string,
  eventTitle: string,
  startTime: Date,
  endTime: Date,
  qrUrl: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Linkup Nouakchott <no-reply@notifications.linkupnouakchott.com>",
    to: email,
    subject: `🎟️ Your ticket for ${eventTitle}`,
    react: (
      <TicketEmail
        title={eventTitle}
        startTime={startTime}
        endTime={endTime}
        qrUrl={qrUrl}
      />
    ),
  });
}
