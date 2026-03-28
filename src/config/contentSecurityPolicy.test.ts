const mockGetReleaseStage = jest.fn();

jest.mock("../../scripts/build/build_config_helpers", () => ({
  getReleaseStage: mockGetReleaseStage,
}));

const prodCspHeaderFixture = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https: http: https://vercel.live https://vercel.com https://*.posthog.com *.clerk.accounts.dev https://cdn.mux.com https://mux.com https://*.mux.com https://stream.mux.com https://*.gleap.io/ https://translate.google.com/ https://translate.googleapis.com/ https://www.gstatic.com/ https://*.google.com/;
    style-src 'self' 'unsafe-inline' https://vercel.live/ https://*.mux.com;
    img-src 'self' blob: data: https: *.thenational.academy/ thenational.academy/ https://vercel.live/ https://vercel.com *.pusher.com/ data: blob: https://*.hubspot.com/ https://*.hsforms.com/ https://track.hubspot.com/ https://res.cloudinary.com/ https://res.cloudinary.com https://oaknationalacademy-res.cloudinary.com/ https://oaknationalacademy-res.cloudinary.com https://*.cloudinary.com/ https://*.cloudinary.com https://res.cloudinary.com/oak-web-application/ https://img.clerk.com/ https://*.mux.com/ https://stream.mux.com/ https://*.gleap.io/ https://translate.googleusercontent.com https://ssl.gstatic.com;
    font-src 'self' gstatic-fonts.thenational.academy/ fonts.gstatic.com/ data: https://vercel.live/ https://assets.vercel.com;
    object-src 'self' *.google.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' *.google.com/;
    connect-src *.thenational.academy thenational.academy https://vercel.live/ https://vercel.com *.pusher.com *.pusherapp.com *.hubspot.com *.hsforms.com *.cloudinary.com/ https://eu.i.posthog.com *.posthog.com https://api.avo.app/ *.clerk.accounts.dev clerk-telemetry.com https://mux.com https://*.mux.com https://stream.mux.com https://inferred.litix.io *.gleap.io wss://*.gleap.io *.google.com *.bugsnag.smartbear.com *.bugsnag.com;
    media-src 'self' blob: *.thenational.academy/ https://res.cloudinary.com/ https://oaknationalacademy-res.cloudinary.com/ https://*.cloudinary.com/ https://*.mux.com/ https://stream.mux.com/ https://*.gleap.io/ https://ssl.gstatic.com;
    frame-src 'self' *.thenational.academy/ https://vercel.live/ https://vercel.com https://challenges.cloudflare.com https://www.avo.app/ https://stream.mux.com https://*.mux.com https://*.gleap.io/ *.google.com/;
    worker-src 'self' blob: *.thenational.academy/;
    child-src blob:;
    report-uri https://eu.i.posthog.com/report/?token=test-api-key&sample_rate=0.05&v=1;
    report-to posthog;
`;

const devCspHeaderFixture = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https: http: 'unsafe-eval' http://localhost:* https://localhost:* https://vercel.live https://vercel.com https://*.posthog.com *.clerk.accounts.dev https://cdn.mux.com https://mux.com https://*.mux.com https://stream.mux.com https://*.gleap.io/ https://translate.google.com/ https://translate.googleapis.com/ https://www.gstatic.com/ https://*.google.com/;
    style-src 'self' 'unsafe-inline' https://vercel.live/ https://*.mux.com;
    img-src 'self' blob: data: https: *.thenational.academy/ thenational.academy/ https://vercel.live/ https://vercel.com *.pusher.com/ data: blob: https://*.hubspot.com/ https://*.hsforms.com/ https://track.hubspot.com/ https://res.cloudinary.com/ https://res.cloudinary.com https://oaknationalacademy-res.cloudinary.com/ https://oaknationalacademy-res.cloudinary.com https://*.cloudinary.com/ https://*.cloudinary.com https://res.cloudinary.com/oak-web-application/ https://img.clerk.com/ https://*.mux.com/ https://stream.mux.com/ https://*.gleap.io/ https://translate.googleusercontent.com https://ssl.gstatic.com;
    font-src 'self' gstatic-fonts.thenational.academy/ fonts.gstatic.com/ data: https://vercel.live/ https://assets.vercel.com;
    object-src 'self' *.google.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' http://localhost:* https://localhost:* *.google.com/;
    connect-src *.thenational.academy thenational.academy http://localhost:* https://localhost:* wss://localhost:* ws://localhost:* https://vercel.live/ https://vercel.com *.pusher.com *.pusherapp.com *.hubspot.com *.hsforms.com *.cloudinary.com/ https://eu.i.posthog.com *.posthog.com https://api.avo.app/ *.clerk.accounts.dev clerk-telemetry.com https://mux.com https://*.mux.com https://stream.mux.com https://inferred.litix.io *.gleap.io wss://*.gleap.io *.google.com *.bugsnag.smartbear.com *.bugsnag.com;
    media-src 'self' blob: *.thenational.academy/ https://res.cloudinary.com/ https://oaknationalacademy-res.cloudinary.com/ https://*.cloudinary.com/ https://*.mux.com/ https://stream.mux.com/ https://*.gleap.io/ https://ssl.gstatic.com;
    frame-src 'self' *.thenational.academy/ https://vercel.live/ https://vercel.com https://challenges.cloudflare.com https://www.avo.app/ https://stream.mux.com https://*.mux.com https://*.gleap.io/ *.google.com/;
    worker-src 'self' blob: *.thenational.academy/;
    child-src blob:;
    report-uri https://eu.i.posthog.com/report/?token=test-api-key;
    report-to posthog;
`;

describe("Content-Security-Policy Header", () => {
  describe("when isDevelopment = true", () => {
    beforeEach(() => {
      mockGetReleaseStage.mockReturnValue(["dev"]);
      process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://eu.i.posthog.com";
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
      process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://eu.i.posthog.com";
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

  describe("PostHog CSP Reporting", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
      // Save original environment
      originalEnv = { ...process.env };
    });

    afterEach(() => {
      // Restore original environment
      process.env = originalEnv;
      jest.resetModules();
    });

    describe("getReportUri function", () => {
      it("should append default sample_rate and version to the report URI", async () => {
        const { getReportUri } = await import("./contentSecurityPolicy");
        const baseUri = "https://eu.i.posthog.com/report/?token=test-key";

        const result = getReportUri(baseUri);

        expect(result).toBe(
          "https://eu.i.posthog.com/report/?token=test-key&sample_rate=0.05&v=1",
        );
      });

      it("should append custom sample_rate when provided", async () => {
        const { getReportUri } = await import("./contentSecurityPolicy");
        const baseUri = "https://eu.i.posthog.com/report/?token=test-key";

        const result = getReportUri(baseUri, 0.1);

        expect(result).toBe(
          "https://eu.i.posthog.com/report/?token=test-key&sample_rate=0.1&v=1",
        );
      });

      it("should append custom version when provided", async () => {
        const { getReportUri } = await import("./contentSecurityPolicy");
        const baseUri = "https://eu.i.posthog.com/report/?token=test-key";

        const result = getReportUri(baseUri, 0.05, "2");

        expect(result).toBe(
          "https://eu.i.posthog.com/report/?token=test-key&sample_rate=0.05&v=2",
        );
      });

      it("should append custom sample_rate and version when both provided", async () => {
        const { getReportUri } = await import("./contentSecurityPolicy");
        const baseUri = "https://eu.i.posthog.com/report/?token=test-key";

        const result = getReportUri(baseUri, 0.2, "3");

        expect(result).toBe(
          "https://eu.i.posthog.com/report/?token=test-key&sample_rate=0.2&v=3",
        );
      });
    });

    describe("environment variable handling", () => {
      it("should construct posthogReportUri when API key is provided", async () => {
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
        process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://eu.i.posthog.com";

        const { cspHeader } = await import("./contentSecurityPolicy");

        expect(cspHeader).toContain(
          "https://eu.i.posthog.com/report/?token=test-api-key&sample_rate=0.05&v=1",
        );
      });

      it("should use default posthogApiHost when not provided", async () => {
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
        delete process.env.NEXT_PUBLIC_POSTHOG_API_HOST;

        const { cspHeader } = await import("./contentSecurityPolicy");

        expect(cspHeader).toContain(
          "https://eu.i.posthog.com/report/?token=test-api-key&sample_rate=0.05&v=1",
        );
      });

      it("should use custom posthogApiHost when provided", async () => {
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
        process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://custom.posthog.com";

        const { cspHeader } = await import("./contentSecurityPolicy");

        expect(cspHeader).toContain(
          "https://custom.posthog.com/report/?token=test-api-key&sample_rate=0.05&v=1",
        );
      });
    });

    describe("reportingEndpointsHeader", () => {
      it("should export correct format when API key is provided", async () => {
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
        process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://eu.i.posthog.com";

        const { reportingEndpointsHeader } = await import(
          "./contentSecurityPolicy"
        );

        expect(reportingEndpointsHeader).toBe(
          'posthog="https://eu.i.posthog.com/report/?token=test-api-key"',
        );
      });
    });

    describe("integration with CSP header", () => {
      it("should include report-uri directive with correct parameters in CSP header", async () => {
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "integration-test-key";
        process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://test.posthog.com";

        const { cspHeader } = await import("./contentSecurityPolicy");

        expect(cspHeader).toContain("report-uri");
        expect(cspHeader).toContain(
          "https://test.posthog.com/report/?token=integration-test-key&sample_rate=0.05&v=1",
        );
      });

      it("should include report-to directive in CSP header", async () => {
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-key";

        const { cspHeader } = await import("./contentSecurityPolicy");

        expect(cspHeader).toContain("report-to posthog");
      });
    });
  });
});
