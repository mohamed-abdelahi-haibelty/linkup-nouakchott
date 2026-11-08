import { formatDate, formatTime } from "@/lib/utils";

import { EventTicketProps } from "@/types/index";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";

function TicketEmail({ title, startTime, endTime, qrUrl }: EventTicketProps) {
  return (
    <Html>
      <Head />
      <Preview>Your ticket for {title}</Preview>
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "sans-serif" }}>
        <Container
          style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}
        >
          <Heading>Your Ticket for {title}</Heading>
          <Text>Ticket will be active from:</Text>
          <Text>
            <b>{`${formatDate(startTime)} - ${formatTime(startTime)}`}</b> →{" "}
            <b>{`${formatDate(endTime)} - ${formatTime(endTime)}`}</b>
          </Text>
          <Img
            src={qrUrl}
            alt="QR Code"
            width="180"
            height="180"
            style={{ margin: "16px auto", display: "block" }}
          />
          <Text>Show this QR code at the event entrance.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default TicketEmail;
