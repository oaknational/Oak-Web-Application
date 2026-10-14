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
  hubspotPortalId?: string;
  payload: HubspotPayload;
  isFallbackAttempt?: boolean;
};

const fetchHubspotFormResponse = async (
  url: string,
  payload: HubspotPayload,
  errorMeta: ErrorMeta,
): Promise<Response> => {
  try {
    return await fetch(url, {
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
};

const getHubspotSuccessMessage = async (
  response: Response,
  errorMeta: ErrorMeta,
) => {
  const responseBody = await response.json();
  errorMeta.responseBody = responseBody;

  try {
    return hubspotSuccessSchema.parse(responseBody).inlineMessage;
  } catch (_error) {
    return undefined;
  }
};

const getFallbackPayload = (
  payload: HubspotPayload,
  errorMeta: ErrorMeta,
): HubspotPayload => {
  const emailField = payload.fields.find((field) => field.name === "email");
  const emailTextOnly = emailField?.value?.split("@")[0];

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

// A successful fallback still throws hubspot/invalid-email for the caller to handle.
const submitInvalidEmailFallback = async (
  payload: HubspotPayload,
  errorMeta: ErrorMeta,
): Promise<never> => {
  try {
    await hubspotSubmitForm({
      hubspotFormId: hubspotFallbackFormId,
      payload: getFallbackPayload(payload, errorMeta),
      isFallbackAttempt: true,
    });
    throw new OakError({ code: "hubspot/invalid-email" });
  } catch (fallbackFormError) {
    if (fallbackFormError instanceof OakError) {
      throw fallbackFormError;
    }

    throw new OakError({
      code: "hubspot/unknown",
      originalError: fallbackFormError,
      meta: errorMeta,
    });
  }
};

// INVALID_EMAIL includes HubSpot's DNS and blocklist checks, so it doesn't prove the address is malformed.
const throwHubspotResponseError = async (
  response: Response,
  props: HubspotSubmitFormProps,
  errorMeta: ErrorMeta,
): Promise<never> => {
  errorMeta.responseStatusCode = response.status;

  let hubspotError: z.infer<typeof hubspotErrorSchema>;
  try {
    const responseBody = await response.json();
    errorMeta.responseBody = responseBody;
    hubspotError = hubspotErrorSchema.parse(responseBody);
  } catch (error) {
    throw new OakError({
      code: "hubspot/unknown",
      originalError: error,
      meta: errorMeta,
    });
  }

  errorMeta.hubspotError = hubspotError;
  const isInvalidEmail = hubspotError.errors.some(
    (err) => err.errorType === "INVALID_EMAIL",
  );
  errorMeta.isInvalidEmail = isInvalidEmail;

  if (isInvalidEmail && !props.isFallbackAttempt) {
    return submitInvalidEmailFallback(props.payload, errorMeta);
  }

  throw new OakError({
    code: "hubspot/unknown",
    meta: errorMeta,
  });
};

// Normalize unexpected failures so retry and reporting handle them consistently.
const submitHubspotFormAttempt = async (props: HubspotSubmitFormProps) => {
  const { hubspotFormId, payload } = props;
  const errorMeta: ErrorMeta = { props };

  try {
    errorMeta.payload = payload;
    const url = `${hubspotFormSubmissionUrl}/${props.hubspotPortalId ?? hubspotPortalId}/${hubspotFormId}`;
    const response = await fetchHubspotFormResponse(url, payload, errorMeta);

    if (response.ok) {
      return await getHubspotSuccessMessage(response, errorMeta);
    }

    return await throwHubspotResponseError(response, props, errorMeta);
  } catch (error) {
    const oakError =
      error instanceof OakError
        ? error
        : new OakError({
            code: "hubspot/unknown",
            originalError: error,
            meta: errorMeta,
          });

    throw oakError;
  }
};

const retryCount = 2;
const retryDelayMs = 250;

const isRetryableError = (error: OakError) => {
  if (error.code === "misc/network-error") return true;

  const hubspotErrors = (
    error.meta?.hubspotError as
      | { errors?: { errorType?: string }[] }
      | undefined
  )?.errors;
  if (hubspotErrors?.some(({ errorType }) => errorType === "ERROR 429")) {
    return true;
  }

  const responseStatusCode = error.meta?.responseStatusCode;
  return (
    responseStatusCode === 429 ||
    (typeof responseStatusCode === "number" &&
      responseStatusCode >= 500 &&
      responseStatusCode < 600)
  );
};

const submitWithRetry = async (
  props: HubspotSubmitFormProps,
  attempt = 1,
): Promise<string | undefined> => {
  try {
    return await submitHubspotFormAttempt(props);
  } catch (error) {
    const oakError =
      error instanceof OakError
        ? error
        : new OakError({
            code: "hubspot/unknown",
            originalError: error,
          });

    const {
      hasBeenReported: errorHasBeenReported,
      config: { shouldNotify: shouldNotifyError },
    } = oakError;

    const hasRetriesRemaining = attempt < retryCount;

    const shouldRetry =
      hasRetriesRemaining &&
      !errorHasBeenReported &&
      isRetryableError(oakError);

    if (shouldRetry) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      return submitWithRetry(props, attempt + 1);
    }

    if (shouldNotifyError && !errorHasBeenReported) {
      void reportError(oakError, oakError.meta);
      oakError.hasBeenReported = true;
    }

    throw oakError;
  }
};

const hubspotSubmitForm = async (props: HubspotSubmitFormProps) => {
  return submitWithRetry(props);
};

export default hubspotSubmitForm;
