import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ default: { $transaction: vi.fn() } }));
vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({ getUser: getKindeUser }),
}));
const { getKindeUser } = vi.hoisted(() => ({ getKindeUser: vi.fn() }));
vi.mock("@/lib/guest", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/guest")>()),
  getGuest: vi.fn(),
}));
import prisma from "@/lib/db";
import { getGuest } from "@/lib/guest";
import { GET, POST, DELETE } from "@/app/api/guest/route";
const tx = {
  $executeRaw: vi.fn(),
  guestSession: { count: vi.fn(), create: vi.fn() },
  user: { create: vi.fn() },
};
const request = (origin?: string) =>
  new NextRequest("https://linkup.example/api/guest", {
    method: "POST",
    headers: origin ? { origin } : {},
  });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("KINDE_SITE_URL", "https://linkup.example");
  vi.stubEnv("KINDE_CLIENT_SECRET", "test-secret");
  getKindeUser.mockResolvedValue(null);
  vi.mocked(getGuest).mockResolvedValue(null);
  tx.guestSession.count.mockResolvedValue(0);
  vi.mocked(prisma.$transaction).mockImplementation(async (callback: unknown) =>
    (callback as (value: typeof tx) => Promise<unknown>)(tx),
  );
});
it.each([undefined, "https://evil.example"])(
  "rejects missing or foreign origins before database writes",
  async (origin) => {
    expect((await POST(request(origin))).status).toBe(403);
    expect((await DELETE(request(origin))).status).toBe(403);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  },
);
it("keeps a regular Kinde identity and does not create a guest", async () => {
  getKindeUser.mockResolvedValue({ id: "member" });
  expect((await POST(request("https://linkup.example"))).status).toBe(200);
  expect(prisma.$transaction).not.toHaveBeenCalled();
  expect((await (await GET()).json()).user).toBeNull();
});
it("reuses an active guest without consuming another account", async () => {
  vi.mocked(getGuest).mockResolvedValue({
    id: "guest_a",
    given_name: "Guest",
    family_name: "",
    email: null,
    picture: null,
  });
  expect((await POST(request("https://linkup.example"))).status).toBe(200);
  expect(prisma.$transaction).not.toHaveBeenCalled();
});
it("enforces the creation limit before making a user", async () => {
  tx.guestSession.count.mockResolvedValue(5);
  expect((await POST(request("https://linkup.example"))).status).toBe(429);
  expect(tx.user.create).not.toHaveBeenCalled();
});
it("stores a digest and gives a new user only the default ordinary role", async () => {
  const response = await POST(request("https://linkup.example"));
  expect(response.status).toBe(200);
  const cookie = response.cookies.get("linkup_guest")!.value;
  const stored = tx.guestSession.create.mock.calls[0][0].data;
  expect(stored.tokenHash).not.toBe(cookie);
  expect(stored.tokenHash).toMatch(/^[a-f0-9]{64}$/);
  expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  expect(tx.user.create.mock.calls[0][0].data.role).toBeUndefined();
  expect(stored.expiresAt.getTime() - Date.now()).toBeGreaterThan(23 * 3600000);
});
