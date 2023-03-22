/**
 * @see https://legacydocs.hubxspot.com/docs/methods/forms/submit_form
 */

import { z } from "zod";

import errorReporter from "../../../common-lib/error-reporter";
import config from "../../../config/browser";
import OakError, { ErrorMeta } from "../../../errors/OakError";
import { UtmParams } from "../../../hooks/useUtmParams";

import getHubspotFormPayload from "./getHubspotFormPayload";
import getHubspotUserToken from "./getHubspotUserToken";

const hubspotPortalId = config.get("hubspotPortalId");
const hubspotFallbackFormId = config.get("hubspotFallbackFormId");

const reportError = errorReporter("hubspotSubmitForm", {
  hubspotPortalId,
  hubspotFallbackFormId,
});

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
const hubspotErrorSchema = z.object({
  errors: z.array(
    z.object({
      errorType: z.enum(HUBSPOT_ERRORS),
      message: z.string().optional(),
    })
  ),
});
const hubspotSuccessSchema = z.object({
  inlineMessage: z.string().optional(),
});

export const USER_ROLES = ["Teacher", "Parent", "Student", "Other"] as const;
export type UserRole = typeof USER_ROLES[number];

export type HubspotFormData = {
  // when sending email to 'fallback' form
  emailTextOnly?: string;
  email?: string;
  oakUserId?: string;
  name: string;
  /**
   * allow "" for userRole as it's easier [than null/undefined] to use as a
   * form value. It is stripped out in getHubspotFormPayload.
   */
  userRole: UserRole | "";
} & UtmParams;
type HubspotSubmitFormProps = {
  hubspotFormId: string;
  data: HubspotFormData;
  isFallbackAttempt?: boolean;
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
const hubspotSubmitForm = async (props: HubspotSubmitFormProps) => {
  const { hubspotFormId, data, isFallbackAttempt = false } = props;
  const errorMeta: ErrorMeta = { props };

  try {
    const hutk = getHubspotUserToken();

    const payload = getHubspotFormPayload({ hutk, data });

    errorMeta.payload = payload;

    // Cloudflare worker proxy forwards hubspot-forms.thenational.academy -> api.hsforms.com
    const url = `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`;

    const res = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const responseBody = await res.json();
      errorMeta.responseBody = responseBody;

      try {
        const hubspotSuccess = hubspotSuccessSchema.parse(responseBody);
        return hubspotSuccess.inlineMessage;
      } catch (error) {
        // Not an issue, form responded with 200 but optional inlineMessage was not present
      }
    }

    if (!res.ok) {
      const responseBody = await res.json();
      errorMeta.responseBody = responseBody;

      try {
        const hubspotError = hubspotErrorSchema.parse(responseBody);
        errorMeta.hubspotError = hubspotError;
        const isInvalidEmail = hubspotError.errors.some(
          (err) => err.errorType === "INVALID_EMAIL"
        );
        errorMeta.isInvalidEmail = isInvalidEmail;

        if (isInvalidEmail && !isFallbackAttempt) {
          /**
           * For INVALID_EMAIL errors, attempt to send data to the fallback form
           */
          try {
            const fallbackFormData = {
              emailTextOnly: data.email,
              ...data,
            };
            delete fallbackFormData.email;
            await hubspotSubmitForm({
              hubspotFormId: hubspotFallbackFormId,
              data: fallbackFormData,
              isFallbackAttempt: true,
            });
            /**
             * In this case we have successfully sent the user's information to
             * the fallback form, however hubspot has signalled that the email
             * might not be right.
             */
            throw new OakError({ code: "hubspot/invalid-email" });
          } catch (fallbackFormError) {
            if (fallbackFormError instanceof OakError) {
              throw fallbackFormError;
            }
            /**
             * In this case we have not been able to collect the user's
             * information
             */
            throw new OakError({
              code: "hubspot/unknown",
              originalError: fallbackFormError,
              meta: errorMeta,
            });
          }
        }
        /**
         * Either we have received a hubspot error other than INVALID_EMAIL
         * or we've recieved INVALID_EMAIL in response to the fallback form
         * (which should never happen is the fallback form doesn't have an
         * email field.
         */
        throw new OakError({
          code: "hubspot/unknown",
          meta: errorMeta,
        });
      } catch (error) {
        if (error instanceof OakError) {
          throw error;
        }
        /**
         * We've recieved an error but not been able to parse it as a hubspot errror
         */
        throw new OakError({
          code: "hubspot/unknown",
          originalError: error,
          meta: errorMeta,
        });
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Network request failed") {
      throw new OakError({ code: "misc/network-error" });
    }

    const oakError =
      error instanceof OakError
        ? error
        : new OakError({
            code: "hubspot/unknown",
            originalError: error,
            meta: errorMeta,
          });

    if (oakError.config.shouldNotify) {
      // should not report if already reported!
      reportError(oakError, oakError.meta);
    }
    throw oakError;
  }
};

export default hubspotSubmitForm;
