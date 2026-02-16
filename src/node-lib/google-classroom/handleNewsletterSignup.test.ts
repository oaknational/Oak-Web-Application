/**
 * @jest-environment node
 */
import { handleNewsletterSignup } from "./handleNewsletterSignup";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

jest.mock("@/browser-lib/getBrowserConfig");
const mockedGetBrowserConfig = getBrowserConfig as jest.MockedFunction<
  typeof getBrowserConfig
>;

const mockReportError = jest.fn();

describe("handleNewsletterSignup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  const setupConfig = (overrides: Record<string, string | null> = {}) => {
    const defaults: Record<string, string | null> = {
      releaseStage: "production",
      hubspotFormSubmissionUrl: "https://hubspot.example.com/submit",
      hubspotProductionGoogleClassroomPortalId: "portal-123",
      hubspotGoogleClassroomFormId: "form-456",
      hubspotSandbox2PortalId: "sandbox-portal",
      hubspotGoogleClassroomSandbox2FormId: "sandbox-form",
      ...overrides,
    };
    mockedGetBrowserConfig.mockImplementation(((key: string) => {
      const value = defaults[key];
      if (value === null) {
        throw new Error(`Missing config: ${key}`);
      }
      return value;
    }) as typeof getBrowserConfig);
  };

  it("should POST to HubSpot with the correct payload", async () => {
    setupConfig();

    await handleNewsletterSignup(
      "teacher@example.com",
      "https://app.example.com",
      mockReportError,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hubspot.example.com/submit/portal-123/form-456",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "email", value: "teacher@example.com" },
            { name: "user_type", value: "Teacher" },
            {
              name: "email_consent_on_gc_addon_account_creation",
              value: "true",
            },
          ],
          context: {
            pageUri: "https://app.example.com/classroom/auth/callback",
            pageName: "Google Classroom Sign In",
          },
        }),
      },
    );
    expect(mockReportError).not.toHaveBeenCalled();
  });

  it("should use sandbox config in development", async () => {
    setupConfig({ releaseStage: "development" });

    await handleNewsletterSignup(
      "teacher@example.com",
      "https://app.example.com",
      mockReportError,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hubspot.example.com/submit/sandbox-portal/sandbox-form",
      expect.any(Object),
    );
  });

  it("should report a warning if HubSpot config is missing", async () => {
    setupConfig({ hubspotFormSubmissionUrl: null });

    await handleNewsletterSignup(
      "teacher@example.com",
      "https://app.example.com",
      mockReportError,
    );

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockReportError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Missing HubSpot configuration for newsletter signup",
      }),
      { severity: "warning" },
    );
  });

  it("should report a warning if HubSpot returns a non-ok response", async () => {
    setupConfig();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({ error: "bad request" }),
    });

    await handleNewsletterSignup(
      "teacher@example.com",
      "https://app.example.com",
      mockReportError,
    );

    expect(mockReportError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "HubSpot newsletter form submission failed: 400",
      }),
      { severity: "warning", responseBody: { error: "bad request" } },
    );
  });

  it("should report a warning if fetch throws", async () => {
    setupConfig();
    const networkError = new Error("Network failure");
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await handleNewsletterSignup(
      "teacher@example.com",
      "https://app.example.com",
      mockReportError,
    );

    expect(mockReportError).toHaveBeenCalledWith(networkError, {
      severity: "warning",
    });
  });
});
