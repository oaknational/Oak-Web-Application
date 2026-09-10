const mockGetReleaseStage = jest.fn();

jest.mock("../../scripts/build/build_config_helpers", () => ({
  getReleaseStage: mockGetReleaseStage,
}));

const prodCspHeaderFixture = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://vercel.live https://vercel.com https://js-eu1.hs-scripts.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hscollectedforms.net https://*.hubspot.com https://*.posthog.com https://eu.i.posthog.com *.clerk.accounts.dev https://clerk.thenational.academy https://cdn.mux.com https://mux.com https://*.mux.com https://stream.mux.com https://*.gleap.io/ https://translate.google.com/ https://translate.googleapis.com/ https://www.gstatic.com/ https://*.google.com/;
    style-src 'self' 'unsafe-inline' https://vercel.live/ https://*.mux.com;
    img-src 'self' blob: data: https: *.thenational.academy/ thenational.academy/;
    font-src 'self' gstatic-fonts.thenational.academy/ fonts.gstatic.com/ data: https://vercel.live/ https://assets.vercel.com;
    object-src 'self' *.google.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' https://classroom.google.com *.google.com/;
    connect-src 'self' *.thenational.academy thenational.academy https://vercel.live/ https://vercel.com *.pusher.com *.pusherapp.com *.hubspot.com *.hsforms.com *.hubapi.com *.hs-banner.com *.hscollectedforms.net *.cloudinary.com/ https://eu.i.posthog.com *.posthog.com https://api.avo.app/ *.clerk.accounts.dev clerk-telemetry.com https://mux.com https://*.mux.com https://stream.mux.com https://inferred.litix.io *.gleap.io wss://*.gleap.io *.google.com *.bugsnag.smartbear.com *.bugsnag.com;
    media-src 'self' blob: *.thenational.academy/ https://res.cloudinary.com/ https://oaknationalacademy-res.cloudinary.com/ https://*.cloudinary.com/ https://*.mux.com/ https://stream.mux.com/ https://*.gleap.io/ https://ssl.gstatic.com;
    frame-src 'self' *.thenational.academy/ https://vercel.live/ https://vercel.com https://challenges.cloudflare.com https://www.avo.app/ https://stream.mux.com https://*.mux.com https://*.gleap.io/ *.google.com/;
    worker-src 'self' blob: *.thenational.academy/;
    child-src blob:;
    report-uri https://eu.i.posthog.com/report/?token=test-api-key&sample_rate=0.05&v=1;
    report-to posthog;
    upgrade-insecure-requests;
`;

const devCspHeaderFixture = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:* https://vercel.live https://vercel.com https://js-eu1.hs-scripts.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hscollectedforms.net https://*.hubspot.com https://*.posthog.com https://eu.i.posthog.com *.clerk.accounts.dev https://clerk.thenational.academy https://cdn.mux.com https://mux.com https://*.mux.com https://stream.mux.com https://*.gleap.io/ https://translate.google.com/ https://translate.googleapis.com/ https://www.gstatic.com/ https://*.google.com/;
    style-src 'self' 'unsafe-inline' https://vercel.live/ https://*.mux.com;
    img-src 'self' blob: data: https: *.thenational.academy/ thenational.academy/;
    font-src 'self' gstatic-fonts.thenational.academy/ fonts.gstatic.com/ data: https://vercel.live/ https://assets.vercel.com;
    object-src 'self' *.google.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' https://classroom.google.com http://localhost:* https://localhost:* *.google.com/;
    connect-src 'self' *.thenational.academy thenational.academy http://localhost:* https://localhost:* wss://localhost:* ws://localhost:* https://vercel.live/ https://vercel.com *.pusher.com *.pusherapp.com *.hubspot.com *.hsforms.com *.hubapi.com *.hs-banner.com *.hscollectedforms.net *.cloudinary.com/ https://eu.i.posthog.com *.posthog.com https://api.avo.app/ *.clerk.accounts.dev clerk-telemetry.com https://mux.com https://*.mux.com https://stream.mux.com https://inferred.litix.io *.gleap.io wss://*.gleap.io *.google.com *.bugsnag.smartbear.com *.bugsnag.com;
    media-src 'self' blob: *.thenational.academy/ https://res.cloudinary.com/ https://oaknationalacademy-res.cloudinary.com/ https://*.cloudinary.com/ https://*.mux.com/ https://stream.mux.com/ https://*.gleap.io/ https://ssl.gstatic.com;
    frame-src 'self' *.thenational.academy/ https://vercel.live/ https://vercel.com https://challenges.cloudflare.com https://www.avo.app/ https://stream.mux.com https://*.mux.com https://*.gleap.io/ *.google.com/;
    worker-src 'self' blob: *.thenational.academy/;
    child-src blob:;
    report-uri https://eu.i.posthog.com/report/?token=test-api-key;
    report-to posthog;
`;

const normaliseCsp = (value: string) => value.replaceAll(/\s+/g, " ").trim();

/** Pull a single directive out of a policy, so a test can assert on its sources
 * without pinning every other source in the directive. */
const getDirective = (cspHeader: string, name: string) =>
  normaliseCsp(cspHeader)
    .split(";")
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith(`${name} `));

describe("Content-Security-Policy Header", () => {
  describe("when isDevelopment = true", () => {
    beforeEach(() => {
      mockGetReleaseStage.mockReturnValue(["dev"]);
      process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://eu.i.posthog.com";
      process.env.NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN = "js-eu1.hs-scripts.com";
    });

    afterEach(() => {
      jest.resetModules();
    });

    it("should include development-specific 'localhost' and 'unsafe-eval' rules", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(normaliseCsp(cspHeader)).toBe(normaliseCsp(devCspHeaderFixture));
    });

    it("should NOT include 'upgrade-insecure-requests' when in development", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).not.toContain("upgrade-insecure-requests;");
    });

    it("should correctly merge all development directives", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(normaliseCsp(cspHeader)).toBe(normaliseCsp(devCspHeaderFixture));
    });
  });

  describe("when isDevelopment = false", () => {
    beforeEach(() => {
      mockGetReleaseStage.mockReturnValue(["production"]);
      process.env.NEXT_PUBLIC_POSTHOG_API_KEY = "test-api-key";
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST = "https://eu.i.posthog.com";
      process.env.NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN = "js-eu1.hs-scripts.com";
    });

    afterEach(() => {
      jest.resetModules();
    });

    it.each([
      {
        description: "upgrade-insecure-requests outside development",
        expected: "upgrade-insecure-requests;",
      },
      {
        description: "Google Classroom as a frame ancestor",
        expected:
          "frame-ancestors 'self' https://classroom.google.com *.google.com/;",
      },
      {
        description: "the configured PostHog host",
        expected: "https://eu.i.posthog.com",
      },
      {
        description: "the production Clerk frontend",
        expected: "https://clerk.thenational.academy",
      },
      {
        description: "same-origin connections",
        expected: "connect-src 'self'",
      },
    ])("includes $description", async ({ expected }) => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).toContain(expected);
    });

    it.each([
      {
        description: "the 'unsafe-eval' development rule",
        excluded: "'unsafe-eval'",
      },
      {
        description: "the localhost development rule",
        excluded: "http://localhost:*",
      },
      {
        description: "scripts from arbitrary HTTP or HTTPS origins",
        excluded: "script-src 'self' 'unsafe-inline' https: http:",
      },
    ])("does not include $description", async ({ excluded }) => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(cspHeader).not.toContain(excluded);
    });

    it("allows a configured PostHog host for scripts and connections", async () => {
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST =
        "https://custom.posthog-proxy.example";

      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(getDirective(cspHeader, "script-src")).toContain(
        "https://custom.posthog-proxy.example",
      );
      expect(getDirective(cspHeader, "connect-src")).toContain(
        "https://custom.posthog-proxy.example",
      );
    });

    it("allows the configured HubSpot tracking code and the scripts it loads", async () => {
      process.env.NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN = "js-eu2.hs-scripts.com";

      const { cspHeader } = await import("./contentSecurityPolicy");
      const scriptSrc = getDirective(cspHeader, "script-src");

      // The loader itself, from config...
      expect(scriptSrc).toContain("https://js-eu2.hs-scripts.com");
      // ...and the chain of scripts the loader goes on to pull in.
      expect(scriptSrc).toContain("https://*.hs-analytics.net");
      expect(scriptSrc).toContain("https://*.hs-banner.com");
      expect(scriptSrc).toContain("https://*.hscollectedforms.net");
    });

    it("should correctly merge all production-required directives", async () => {
      const { cspHeader } = await import("./contentSecurityPolicy");

      expect(normaliseCsp(cspHeader)).toBe(normaliseCsp(prodCspHeaderFixture));
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
          'posthog="https://eu.i.posthog.com/report/?token=test-api-key&sample_rate=0.05&v=1"',
        );
      });

      it("omits reporting directives when no PostHog API key is configured", async () => {
        delete process.env.NEXT_PUBLIC_POSTHOG_API_KEY;

        const { cspHeader, reportingEndpointsHeader } = await import(
          "./contentSecurityPolicy"
        );

        expect(cspHeader).not.toContain("report-uri");
        expect(cspHeader).not.toContain("report-to");
        expect(reportingEndpointsHeader).toBeUndefined();
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
