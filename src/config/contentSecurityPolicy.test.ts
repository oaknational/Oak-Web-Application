const mockGetReleaseStage = jest.fn();

jest.mock("../../scripts/build/build_config_helpers", () => ({
  getReleaseStage: mockGetReleaseStage,
}));

const prodCspHeaderFixture = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https: http: https://vercel.live https://vercel.com *.clerk.accounts.dev https://cdn.mux.com https://mux.com https://*.mux.com https://stream.mux.com;
    style-src 'self' 'unsafe-inline' https://vercel.live/ https://*.mux.com;
    img-src 'self' blob: data: *.thenational.academy thenational.academy https://vercel.live/ https://vercel.com *.pusher.com/ data: blob: https://*.hubspot.com https://*.hsforms.com https://res.cloudinary.com https://oaknationalacademy-res.cloudinary.com https://*.cloudinary.com https://img.clerk.com https://*.mux.com https://stream.mux.com *.gleap.io https://staticfiles.gleap.io;
    font-src 'self' gstatic-fonts.thenational.academy fonts.gstatic.com data: https://vercel.live/ https://assets.vercel.com;
    object-src 'self' *.google.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' *.google.com;
    connect-src *.thenational.academy thenational.academy https://vercel.live/ https://vercel.com *.pusher.com *.pusherapp.com *.hubspot.com *.hsforms.com *.cloudinary.com https://eu.i.posthog.com *.posthog.com https://api.avo.app/ *.clerk.accounts.dev clerk-telemetry.com https://mux.com https://*.mux.com https://stream.mux.com https://inferred.litix.io *.gleap.io wss://*.gleap.io *.google.com *.bugsnag.smartbear.com *.bugsnag.com;
    media-src 'self' blob: *.thenational.academy https://*.mux.com https://stream.mux.com;
    frame-src 'self' *.thenational.academy https://vercel.live/ https://vercel.com https://challenges.cloudflare.com https://www.avo.app/ https://stream.mux.com https://*.mux.com *.google.com;
    worker-src 'self' blob:;
    child-src blob:;
    report-uri https://localhost:3000/api/csp-report;
    report-to oak-csp;
`;

const devCspHeaderFixture = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https: http: 'unsafe-eval' http://localhost:* https://localhost:* https://vercel.live https://vercel.com *.clerk.accounts.dev https://cdn.mux.com https://mux.com https://*.mux.com https://stream.mux.com;
    style-src 'self' 'unsafe-inline' https://vercel.live/ https://*.mux.com;
    img-src 'self' blob: data: *.thenational.academy thenational.academy https://vercel.live/ https://vercel.com *.pusher.com/ data: blob: https://*.hubspot.com https://*.hsforms.com https://res.cloudinary.com https://oaknationalacademy-res.cloudinary.com https://*.cloudinary.com https://img.clerk.com https://*.mux.com https://stream.mux.com *.gleap.io https://staticfiles.gleap.io;
    font-src 'self' gstatic-fonts.thenational.academy fonts.gstatic.com data: https://vercel.live/ https://assets.vercel.com;
    object-src 'self' *.google.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' http://localhost:* https://localhost:* *.google.com;
    connect-src *.thenational.academy thenational.academy http://localhost:* https://localhost:* wss://localhost:* ws://localhost:* https://vercel.live/ https://vercel.com *.pusher.com *.pusherapp.com *.hubspot.com *.hsforms.com *.cloudinary.com https://eu.i.posthog.com *.posthog.com https://api.avo.app/ *.clerk.accounts.dev clerk-telemetry.com https://mux.com https://*.mux.com https://stream.mux.com https://inferred.litix.io *.gleap.io wss://*.gleap.io *.google.com *.bugsnag.smartbear.com *.bugsnag.com;
    media-src 'self' blob: *.thenational.academy https://*.mux.com https://stream.mux.com;
    frame-src 'self' *.thenational.academy https://vercel.live/ https://vercel.com https://challenges.cloudflare.com https://www.avo.app/ https://stream.mux.com https://*.mux.com *.google.com;
    worker-src 'self' blob:;
    child-src blob:;
    report-uri https://localhost:3000/api/csp-report;
    report-to oak-csp;
`;

describe("Content-Security-Policy Header", () => {
  describe("when isDevelopment = true", () => {
    beforeEach(() => {
      mockGetReleaseStage.mockReturnValue(["dev"]);
    });

    afterEach(() => {
      jest.resetModules();
    });

    it("should include development-specific 'localhost' and 'unsafe-eval' rules", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).toContain(devCspHeaderFixture);
    });

    it("should NOT include 'upgrade-insecure-requests' when in development", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).not.toContain("upgrade-insecure-requests;");
    });

    it("should correctly merge all development directives", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).toContain(devCspHeaderFixture);
    });
  });

  describe("when isDevelopment = false", () => {
    beforeEach(() => {
      mockGetReleaseStage.mockReturnValue(["production"]);
    });

    afterEach(() => {
      jest.resetModules();
    });

    // Can uncomment this when we change from report only CSP
    // it("should include 'upgrade-insecure-requests' when not in development", async () => {
    //   const { cspHeader } = await import("./contentSecurityPolicy");
    //
    //   expect(cspHeader).toContain("upgrade-insecure-requests;");
    // });

    it("should exclude development-specific rules ('localhost', 'unsafe-eval')", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).not.toContain("'unsafe-eval'");
      expect(cspHeader).not.toContain("http://localhost:*");
    });

    it("should correctly merge all production-required directives", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).toContain(prodCspHeaderFixture);
    });
  });
});
