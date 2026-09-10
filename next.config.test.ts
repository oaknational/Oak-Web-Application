import { PHASE_TEST } from "next/constants.js";

import nextConfig from "./next.config";

describe("CSP response headers", () => {
  it("emits one complete CSP header for global routes", async () => {
    const config = await nextConfig(PHASE_TEST);
    const headers = await config.headers?.();
    const globalRoute = headers?.find(
      (route) => route.source === "/(.*)",
    );
    const cspHeaders = globalRoute?.headers.filter(
      (header) => header.key.toLowerCase() === "content-security-policy",
    );

    expect(cspHeaders).toHaveLength(1);
    expect(cspHeaders?.[0]?.value).toContain(
      "frame-ancestors 'self' https://classroom.google.com",
    );
    expect(cspHeaders?.[0]?.value).toContain("img-src");
  });
});
