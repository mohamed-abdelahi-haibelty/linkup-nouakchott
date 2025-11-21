import { formatDate, formatTime } from "@/lib/utils";
import { EventTicketProps } from "@/types";

export function EventTicket({
  title,
  startTime,
  endTime,
  qrUrl,
}: EventTicketProps) {
  return (
    <div className="relative bg-foreground rounded-b-2xl overflow-hidden text-white">
      {/* Left Notch */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-background rounded-r-full -ml-3" />

      {/* Right Notch */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-background rounded-l-full -mr-3" />

      {/* Dashed Divider */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/70 z-10 [mask-image:radial-gradient(circle,white_70%,transparent_71%)]" />

      {/* Ticket Content */}
      <div className="relative z-20 flex flex-col">
        {/* Top half */}
        <div className="px-8 pt-6 pb-10">
          <h1 className="text-center mb-1">
            Your Ticket for <span className="font-bold">{title}</span>
          </h1>

          <p className="text-sm text-center mb-3 mt-3">
            Ticket will be active from
          </p>

          <div className="border bg-white text-foreground rounded-lg px-4 py-3 flex justify-between items-center flex-wrap gap-4">
            <div className="text-center flex-1">
              <h3 className="font-semibold">{formatTime(startTime)}</h3>
              <span className="text-xs">{formatDate(startTime)}</span>
            </div>
            <div className="text-center flex-1">
              <h3 className="font-semibold">{formatTime(endTime)}</h3>
              <span className="text-xs">{formatDate(endTime)}</span>
            </div>
          </div>
        </div>

        {/* Bottom half */}
        <div className="px-8 pt-10 pb-8 flex justify-center">
          <img
            src={qrUrl}
            alt="QR Ticket"
            width="140"
            height="140"
            className="block mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

// import { Html, Head, Preview, Body, Container, Heading, Text, Img } from "@react-email/components";

// export const TicketEmail = ({ eventName, startDate, endDate, qrCodeBase64 }) => (
//   <Html>
//     <Head />
//     <Preview>Your ticket for {eventName}</Preview>
//     <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "sans-serif" }}>
//       <Container style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
//         <Heading>Your Ticket for {eventName}</Heading>
//         <Text>Ticket will be active from:</Text>
//         <Text><b>{startDate}</b> → <b>{endDate}</b></Text>
//         <Img
//           src={`data:image/png;base64,${qrCodeBase64}`}
//           alt="QR Code"
//           width="180"
//           height="180"
//           style={{ margin: "16px auto", display: "block" }}
//         />
//         <Text>Show this QR code at the event entrance.</Text>
//       </Container>
//     </Body>
//   </Html>
// );

// import { Resend } from 'resend';
// import { render } from '@react-email/render';
// import { TicketEmail } from './emails/TicketEmail';
// import QRCode from 'qrcode';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendTicketEmail(user, event) {
//   // Generate QR as base64
//   const qrCodeBase64 = await QRCode.toDataURL(event.ticketUrl);
//   const qrCodeImage = qrCodeBase64.replace(/^data:image\/png;base64,/, '');

//   const html = render(
//     <TicketEmail
//       eventName={event.title}
//       startDate={event.start}
//       endDate={event.end}
//       qrCodeBase64={qrCodeImage}
//     />
//   );

//   await resend.emails.send({
//     from: 'noreply@notifications.linkupnouakchott.com',
//     to: user.email,
//     subject: `🎟️ Your ticket for ${event.title}`,
//     html,
//   });
// }
