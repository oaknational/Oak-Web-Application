import type { ErrorData } from "@/common-lib/error-reporter/errorReporter";

type ErrorReporter = (
  maybeError: unknown,
  data?: ErrorData,
) => Promise<void> | void;

export async function handleNewsletterSignup(
  email: string,
  baseUrl: string,
  reportError: ErrorReporter,
) {
  const submissionUrl = process.env.NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL;
  const portalId = process.env.HUBSPOT_GOOGLE_CLASSROOM_PORTAL_ID;
  const formId = process.env.HUBSPOT_GOOGLE_CLASSROOM_FORM_ID;

  if (!submissionUrl || !portalId || !formId) {
    console.error(
      "Missing HubSpot configuration for newsletter signup, skipping submission",
    );
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
