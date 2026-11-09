"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Guest = {
  id: string;
  given_name: string;
  family_name: string;
  email: null;
  picture: null;
};
const GuestContext = createContext<{ guest: Guest | null; loading: boolean }>({
  guest: null,
  loading: true,
});
export function GuestSessionProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/guest", { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((data) => setGuest(data.user))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  return (
    <GuestContext.Provider value={{ guest, loading }}>
      {children}
    </GuestContext.Provider>
  );
}
export function useAppSession() {
  const kinde = useKindeBrowserClient();
  const { guest, loading } = useContext(GuestContext);
  return {
    ...kinde,
    getUser: () => kinde.getUser() || guest,
    isAuthenticated: kinde.isAuthenticated || Boolean(guest),
    isLoading: kinde.isLoading || loading,
    isGuest: !kinde.isAuthenticated && Boolean(guest),
  };
}
