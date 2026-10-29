import { PHASE_TEST } from "next/constants.js";

describe("CSP response headers", () => {
  const originalReleaseStage = process.env.OVERRIDE_RELEASE_STAGE;
  let logSpy: ReturnType<typeof jest.spyOn>;

  beforeAll(() => {
    // `next.config.ts` resolves the release stage at module scope, and
    // `getReleaseStage` logs a fallback warning when none is set. Set one up
    // front, and pull the config in via a dynamic import below so that it is
    // evaluated after this has run.
    process.env.OVERRIDE_RELEASE_STAGE = "production";
    // Evaluating the config also logs when it writes SITEMAP_BASE_URL out to
    // `.env.local`. `jest.setup.js` turns any log into a thrown error, so
    // swallow it here. `console.error` is deliberately left throwing, so a real
    // failure inside the config still fails the test.
    logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterAll(() => {
    logSpy.mockRestore();
    if (originalReleaseStage === undefined) {
      delete process.env.OVERRIDE_RELEASE_STAGE;
    } else {
      process.env.OVERRIDE_RELEASE_STAGE = originalReleaseStage;
    }
    jest.resetModules();
  });

  it("emits one complete CSP header for global routes", async () => {
    const { default: nextConfig } = await import("./next.config");

    const config = await nextConfig(PHASE_TEST);
    const headers = await config.headers?.();
    const globalRoute = headers?.find((route) => route.source === "/(.*)");
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
