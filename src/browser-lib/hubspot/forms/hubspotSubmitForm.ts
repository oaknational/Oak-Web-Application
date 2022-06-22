/**
 * @see https://legacydocs.hubspot.com/docs/methods/forms/submit_form
 */

import { z } from "zod";

const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const hubspotFallbackFormId = process.env.NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID;

if (!hubspotPortalId) {
  throw new Error(
    "Environment variable: NEXT_PUBLIC_HUBSPOT_PORTAL_ID not found"
  );
}

if (!hubspotFallbackFormId) {
  throw new Error(
    "Environment variable: NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID not found"
  );
}
/**
 * From hubspot documentation (see link at top of this file)
 */
const HUBSPOT_ERRORS = [
  "MAX_NUMBER_OF_SUBMITTED_VALUES_EXCEEDED",
  "INVALID_EMAIL",
  "BLOCKED_EMAIL",
  "REQUIRED_FIELD",
  "INVALID_NUMBER",
  "INPUT_TOO_LARGE",
  "FIELD_NOT_IN_FORM_DEFINITION",
  "NUMBER_OUT_OF_RANGE",
  "VALUE_NOT_IN_FIELD_DEFINITION",
  "INVALID_METADATA",
  "INVALID_GOTOWEBINAR_WEBINAR_KEY",
  "INVALID_HUTK",
  "INVALID_IP_ADDRESS",
  "INVALID_PAGE_URI",
  "INVALID_LEGAL_OPTION_FORMAT",
  "MISSING_PROCESSING_CONSENT",
  "MISSING_PROCESSING_CONSENT_TEXT",
  "MISSING_COMMUNICATION_CONSENT_TEXT",
  "MISSING_LEGITIMATE_INTEREST_TEXT",
  "DUPLICATE_SUBSCRIPTION_TYPE_ID",
  "FORM_HAS_RECAPTCHA_ENABLED",
  "ERROR 429",
] as const;
const hubspotResponseSchema = z.object({
  inlineMessage: z.string(),
  errors: z.array(
    z.object({
      errorType: z.enum(HUBSPOT_ERRORS),
      message: z.string(),
    })
  ),
});

/**
 *
 */
const reportError = (msg: string) => {
  console.log(msg);
};

/**
 * Retrieves 'hutk' value from cookies
 */
const getHubspotUserToken = () => {
  // Cookies.get("hubspotutk");
  return 123;
};

type HubspotFormData = {
  // when sending email to 'fallback' form
  emailTextOnly?: string;
  email?: string;
  contactSchoolName?: string;
  contactSchoolUrn?: string;
  oakUserId: string;
  fullName: string;
  userType: string;
};
type HubspotSubmitFormProps = {
  hubspotFormId: string;
  data: HubspotFormData;
  shouldUseFallbackForm: boolean;
};
/**
 * @description
 * Function which, using hubspot cookie, sends data to a hubspot form
 * using the form id.
 *
 * Note:
 *
 * https://community.hubspot.com/t5/Lead-Capture-Tools/Failing-validation-in-hubspot-form-for-emails/td-p/18446
 *
 * Due to the above issue with hubspot's email validation, we implement a fallback form
 * for collecting "invalid" emails. The journey is something along these lines:
 *
 * 1. A user submits a form
 * 2. If we get a Hubspot error "INVALID_EMAIL", this can either be correct (a typo or a false email), or it can be incorrect (a perfectly valid email). We have no way of knowing which it is, so either way we:
 * 3. Show an error to the user saying "That email doesn't look right, please check and try again",
 * 4. And we send the email address to the fallback form in Hubspot.
 * 5. I think should not report the error to Bugsnag, as we're capturing/handling it a different way
 * 6. It might then be that the user sees they have in fact entered their email wrong, and inputs the correct one
 * 7. Or it might be that they think "But that is my email address"
 */
const hubspotSubmitForm = async ({
  hubspotFormId,
  data,
  shouldUseFallbackForm = true,
}: HubspotSubmitFormProps) => {
  try {
    const hutk = getHubspotUserToken();

    const snakeCaseData = {
      email: data.email,
      email_text_only: data.emailTextOnly,
      contact_school_name: data.contactSchoolName,
      contact_school_urn: data.contactSchoolUrn,
      oak_user_id: data.oakUserId,
      full_name: data.fullName,
      user_type: data.userType,
    };

    const payload = {
      fields: Object.entries(snakeCaseData)
        .map(([name, value]) => {
          return {
            name,
            value,
          };
        })
        .filter((field) => field.value),
      context: {
        // hutk param should only be sent if it exists
        ...(hutk ? { hutk } : {}),
        pageUri: document.location.href,
        pageName: document.title,
      },
    };

    // Cloudflare worker proxy forwards hubspot-forms.thenational.academy -> api.hsforms.com
    const url = `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`;

    const res = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status !== 200) {
      const body = await res.json();

      throw body;
    }
  } catch (error) {
    const hubspotError = hubspotResponseSchema.parse(error);
    if (hubspotError.errors.some((err) => err.errorType === "INVALID_EMAIL")) {
      // For INVALID_EMAIL errors, send email to fallback form
      if (shouldUseFallbackForm) {
        try {
          const fallbackFormData = {
            ...data,
            emailTextOnly: data.email,
          };
          await hubspotSubmitForm({
            hubspotFormId: hubspotFallbackFormId,
            data: fallbackFormData,
            shouldUseFallbackForm: false,
          });
        } catch (fallbackFormError) {
          reportError(
            `Hubspot fallback form failed, hubspot form id: ${hubspotFallbackFormId}. Error text: ${JSON.stringify(
              fallbackFormError
            )}`
          );
        }
      }
      throw new Error(
        "Thank you, that's been received, but please check as your email doesn't look quite right."
      );
    }
    reportError(
      `Failed to submit form to Hubspot, hubspot form id: ${hubspotFormId}. Error text: ${JSON.stringify(
        error
      )}`
    );
    throw new Error(
      "Sorry, we couldn't sign you up just now, try again later."
    );
  }
};

export default hubspotSubmitForm;
