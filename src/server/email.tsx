import TicketEmail from "@/features/tickets/components/TicketEmail";
import { Resend } from "resend";
import "server-only";

/** Embed the locally generated QR image instead of sending ticket codes to an external QR service. */
export async function sendTicketEmail(
  email: string,
  eventTitle: string,
  startTime: Date,
  endTime: Date,
  qrDataUrl: string,
) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const image = qrDataUrl.split(",")[1];
  if (!image) throw new Error("Invalid ticket QR image");
  const result = await resend.emails.send({
    from:
      process.env.TICKET_EMAIL_FROM ||
      "Linkup Nouakchott <no-reply@notifications.linkupnouakchott.com>",
    to: email,
    subject: `Your ticket for ${eventTitle}`,
    react: (
      <TicketEmail
        title={eventTitle}
        startTime={startTime}
        endTime={endTime}
        qrUrl="cid:ticket-qr"
      />
    ),
    attachments: [
      { filename: "ticket.png", content: image, contentId: "ticket-qr" },
    ],
  });
  if (result.error) throw new Error("Ticket email delivery failed");
}
