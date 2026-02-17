/**
 * @jest-environment node
 */
import { handleNewsletterSignup } from "./handleNewsletterSignup";

const mockReportError = jest.fn();

describe("handleNewsletterSignup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it("should POST to HubSpot with the correct payload", async () => {
    await handleNewsletterSignup(
      "teacher@example.com",
      "https://app.example.com",
      mockReportError,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/portal-456/form-123",
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

  it("should report a warning if HubSpot config is missing", async () => {
    const savedEnv = {
      NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL:
        process.env.NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL,
      HUBSPOT_GOOGLE_CLASSROOM_PORTAL_ID:
        process.env.HUBSPOT_GOOGLE_CLASSROOM_PORTAL_ID,
      HUBSPOT_GOOGLE_CLASSROOM_FORM_ID:
        process.env.HUBSPOT_GOOGLE_CLASSROOM_FORM_ID,
    };
    delete process.env.NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL;
    delete process.env.HUBSPOT_GOOGLE_CLASSROOM_PORTAL_ID;
    delete process.env.HUBSPOT_GOOGLE_CLASSROOM_FORM_ID;

    await handleNewsletterSignup(
      "teacher@example.com",
      "https://app.example.com",
      mockReportError,
    );

    Object.assign(process.env, savedEnv);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockReportError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Missing HubSpot configuration for newsletter signup",
      }),
      { severity: "warning" },
    );
  });

  it("should report a warning if HubSpot returns a non-ok response", async () => {
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
