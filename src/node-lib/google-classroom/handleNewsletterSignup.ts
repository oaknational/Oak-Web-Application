import type { ErrorData } from "@/common-lib/error-reporter/errorReporter";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

type ErrorReporter = (
  maybeError: unknown,
  data?: ErrorData,
) => Promise<void> | void;

export async function handleNewsletterSignup(
  email: string,
  baseUrl: string,
  reportError: ErrorReporter,
) {
  const isDevelopmentBuild = getBrowserConfig("releaseStage") === "development";

  const submissionUrl = getBrowserConfig("hubspotFormSubmissionUrl");

  const portalId = isDevelopmentBuild
    ? getBrowserConfig("hubspotSandbox2PortalId")
    : getBrowserConfig("hubspotProductionGoogleClassroomPortalId");

  const formId = isDevelopmentBuild
    ? getBrowserConfig("hubspotGoogleClassroomSandbox2FormId")
    : getBrowserConfig("hubspotGoogleClassroomFormId");

  if (!submissionUrl || !portalId || !formId) {
    reportError(
      new Error("Missing HubSpot configuration for newsletter signup"),
      { severity: "warning" },
    );
    return;
  }

  const url = `${submissionUrl}/${portalId}/${formId}`;
  const payload = {
    fields: [
      { name: "email", value: email },
      { name: "user_type", value: "Teacher" },
      { name: "email_consent_on_gc_addon_account_creation", value: "true" },
    ],
    context: {
      pageUri: `${baseUrl}/classroom/auth/callback`,
      pageName: "Google Classroom Sign In",
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const responseBody = await res.json().catch(() => ({}));
      reportError(
        new Error(`HubSpot newsletter form submission failed: ${res.status}`),
        { severity: "warning", responseBody },
      );
    }
  } catch (error) {
    reportError(error, { severity: "warning" });
  }
}
