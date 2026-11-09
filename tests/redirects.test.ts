import { describe, expect, it } from "vitest";
import { postLoginRedirect } from "@/lib/redirects";
const origin = "https://linkup-nouakchott.vercel.app";
describe("post-login navigation", () => {
  it.each([
    "https://other.example/",
    "//other.example/",
    "javascript:alert(1)",
    "https://[",
  ])("rejects an external or malformed destination: %s", (candidate) => {
    expect(postLoginRedirect(candidate, origin).href).toBe(`${origin}/events`);
  });
  it("preserves a local ticket destination", () => {
    expect(postLoginRedirect("/checkin/TKT-1234", origin).href).toBe(
      `${origin}/checkin/TKT-1234`,
    );
  });
});
