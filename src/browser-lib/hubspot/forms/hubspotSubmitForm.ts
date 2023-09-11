/**
 * @see https://legacydocs.hubxspot.com/docs/methods/forms/submit_form
 */

import { z } from "zod";

import errorReporter from "../../../common-lib/error-reporter";
import OakError, { ErrorMeta } from "../../../errors/OakError";
import getBrowserConfig from "../../getBrowserConfig";

const hubspotPortalId = getBrowserConfig("hubspotPortalId");
const hubspotFallbackFormId = getBrowserConfig("hubspotFallbackFormId");
const hubspotFormSubmissionUrl = getBrowserConfig("hubspotFormSubmissionUrl");

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
    }),
  ),
});
const hubspotSuccessSchema = z.object({
  inlineMessage: z.string().optional(),
});

export type HubspotPayload = {
  fields: {
    name: string;
    value: string | undefined;
  }[];
  context: {
    pageUri: string;
    pageName: string;
    hutk?: string | undefined;
  };
};

type HubspotSubmitFormProps = {
  hubspotFormId: string;
  payload: HubspotPayload;
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
  const { hubspotFormId, payload, isFallbackAttempt = false } = props;
  const errorMeta: ErrorMeta = { props };

  try {
    errorMeta.payload = payload;

    // Cloudflare worker proxy forwards hubspot-forms.thenational.academy -> api.hsforms.com
    const url = `${hubspotFormSubmissionUrl}/${hubspotPortalId}/${hubspotFormId}`;

    let res: Response;

    try {
      res = await fetch(url, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      throw new OakError({
        code: "misc/network-error",
        originalError: error,
        meta: errorMeta,
      });
    }

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
          (err) => err.errorType === "INVALID_EMAIL",
        );
        errorMeta.isInvalidEmail = isInvalidEmail;

        if (isInvalidEmail && !isFallbackAttempt) {
          /**
           * For INVALID_EMAIL errors, attempt to send data to the fallback form
           */
          try {
            const emailTextOnly = (payload: HubspotPayload) => {
              const emailField = payload.fields.find(
                (field) => field.name === "email",
              );
              if (!emailField) {
                throw new OakError({
                  code: "hubspot/invalid-email",
                  meta: errorMeta,
                });
              }
              const emailTextOnly = emailField.value?.split("@")[0];
              if (!emailTextOnly) {
                throw new OakError({
                  code: "hubspot/invalid-email",
                  meta: errorMeta,
                });
              }
              return {
                ...payload,
                fields: [
                  ...payload.fields,
                  {
                    name: "emailTextOnly",
                    value: emailTextOnly,
                  },
                ],
              };
            };
            const fallbackPayload = emailTextOnly(payload);

            await hubspotSubmitForm({
              hubspotFormId: hubspotFallbackFormId,
              payload: fallbackPayload,
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
         * We've received an error but not been able to parse it as a hubspot error
         */
        throw new OakError({
          code: "hubspot/unknown",
          originalError: error,
          meta: errorMeta,
        });
      }
    }
  } catch (error) {
    const oakError =
      error instanceof OakError
        ? error
        : new OakError({
            code: "hubspot/unknown",
            originalError: error,
            meta: errorMeta,
          });

    if (oakError.config.shouldNotify) {
      reportError(oakError, oakError.meta);
    }
    throw oakError;
  }
};

export default hubspotSubmitForm;
