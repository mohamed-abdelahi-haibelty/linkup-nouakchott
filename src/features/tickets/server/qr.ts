import { customAlphabet } from "nanoid";
import QRCode from "qrcode";
import "server-only";

const randomCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 12);
export function createTicketCode() {
  const code = randomCode();
  return `TKT-${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}`;
}

export async function ticketQrDataUrl(code: string) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin)
    throw new Error("NEXT_PUBLIC_SITE_URL is required for ticket links");
  const url = new URL(`/checkin/${encodeURIComponent(code)}`, origin);
  return QRCode.toDataURL(url.toString(), { width: 360, margin: 2 });
}
