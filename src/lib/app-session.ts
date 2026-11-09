import "server-only";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getGuest } from "@/lib/guest";

// Verified Kinde identities always take precedence over the temporary cookie.
export function getAppSession() {
  const kinde = getKindeServerSession();
  const getUser = async () => (await kinde.getUser()) || (await getGuest());
  return { getUser, isAuthenticated: async () => Boolean(await getUser()) };
}
