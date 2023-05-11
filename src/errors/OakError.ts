/**
 * Inspired in part by Firebase error handling
 * @see https://github.com/firebase/firebase-admin-node/blob/7ce2345d716697d743e0234e7d45446ca11bc1da/src/utils/error.ts
 */

const ERROR_CODES = [
  "misc/unknown",
  "misc/network-error",
  "misc/unexpected-type",
  "misc/import-count",
  "auth/send-sign-in-link",
  "auth/token-expired",
  "auth/token-error-unknown",
  "graphql/validation", // for this we actually want more details when the error is thrown
  "search/unknown",
  "hubspot/invalid-email",
  "hubspot/unknown",
  "video/unknown",
  "video/fetch-signed-token",
  "hubspot/not-loaded",
  "hubspot/script-failed-to-load",
  "hubspot/lost-information",
  "hubspot/identify-no-email",
  "preview/invalid-token",
  "cms/invalid-reference-data",
  "cms/invalid-hubspot-form",
  "curriculum-api/not-found",
  "curriculum-api/uniqueness-assumption-violated",
  "school-picker/fetch-suggestions",
  "urls/failed-to-resolve",
  "downloads/failed-to-fetch",
  "analytics/pageview-failed",
] as const;
export type ErrorCode = typeof ERROR_CODES[number];

type ErrorConfig = {
  // Message intended for developer's convenience. Human error messages should probably be handled in the view layer
  message: string;
  // @todo responseStatusCode to be union type
  responseStatusCode?: number;
  // Whether or not to notify bugsnag
  shouldNotify: boolean;
};
const errorConfigs: Record<ErrorCode, ErrorConfig> = {
  "misc/unknown": {
    message: "An unknown error has occurred",
    responseStatusCode: 500,
    shouldNotify: true,
  },
  "misc/network-error": {
    message: "Failed to connect.",
    responseStatusCode: 500,
    // If a network error occurs on the server, we want to know about it, maybe not on the client
    shouldNotify: true,
  },
  "auth/token-expired": {
    message: "JWT has expired. Please refresh token and try again",
    responseStatusCode: 401,
    shouldNotify: false,
  },
  "auth/token-error-unknown": {
    message: "Could not verify token",
    responseStatusCode: 403, // check this
    shouldNotify: true,
  },
  "graphql/validation": {
    message: "Graphql validation error",
    responseStatusCode: 500,
    shouldNotify: true,
  },
  "auth/send-sign-in-link": {
    message: "Could not send sign in link to provided email",
    shouldNotify: true,
  },
  "misc/unexpected-type": {
    message:
      "An unexpected type was encountered, so action may not have completed successfully",
    shouldNotify: true,
  },
  "search/unknown": {
    message: "Search doesn't seem to be working, we're looking into it.",
    shouldNotify: true,
  },
  "hubspot/invalid-email": {
    message:
      "Thank you, that's been received, but please check as your email doesn't look quite right.",
    shouldNotify: false,
  },
  "hubspot/unknown": {
    message: "Sorry, we couldn't sign you up just now, try again later.",
    shouldNotify: true,
  },
  "hubspot/not-loaded": {
    message: "Hubspot not properly instantiated",
    shouldNotify: true,
  },
  "hubspot/script-failed-to-load": {
    message:
      "Hubspot script failed to load. Likely a browser connection issue, or script src misconfigured",
    shouldNotify: true,
  },
  "hubspot/lost-information": {
    message: "Information is being lost when sending to hubspot",
    shouldNotify: true,
  },
  "hubspot/identify-no-email": {
    /**
     * @see https://developers.hubspot.com/docs/api/events/tracking-code#identify-a-visitor
     */
    message: "Identify is being called without an email address",
    shouldNotify: true,
  },
  "misc/import-count": {
    message: "File imported more times than allowed",
    shouldNotify: true,
  },
  "video/unknown": {
    message: "Sorry this video couldn't play, please try again",
    shouldNotify: true,
  },
  "video/fetch-signed-token": {
    message: "Failed to fetch signed video token",
    shouldNotify: true,
  },
  "preview/invalid-token": {
    message: "Invalid CMS preview token provided",
    responseStatusCode: 401,
    shouldNotify: false,
  },
  "cms/invalid-reference-data": {
    message: "Couldn't find a matching portable text reference",
    shouldNotify: true,
    responseStatusCode: 500,
  },
  "cms/invalid-hubspot-form": {
    message: "Error fetching or parsing referenced hubspot form",
    shouldNotify: true,
    responseStatusCode: 500,
  },
  "curriculum-api/not-found": {
    message: "Resource not found",
    shouldNotify: false,
    responseStatusCode: 404,
  },
  "curriculum-api/uniqueness-assumption-violated": {
    message: "Multiple resources were found when maximum 1 was expected",
    shouldNotify: true,
  },
  "school-picker/fetch-suggestions": {
    message: "Error fetching suggested schools list",
    shouldNotify: true,
  },
  "urls/failed-to-resolve": {
    message:
      "Failed to resolve URL. Likely caused by a mismatch between the TS types and the pathPattern",
    shouldNotify: true,
  },
  "downloads/failed-to-fetch": {
    message: "Failed to fetch downloads",
    shouldNotify: true,
  },
  "analytics/pageview-failed": {
    message:
      "Could not identify oak page from href. Likely a new page has been added which is not in the urls.ts file. If not fixed, we will miss page views on this page",
    shouldNotify: true,
  },
};

const getErrorConfig = (code: ErrorCode) => errorConfigs[code];

export const getErrorMessage = (errorInfo: ErrorInfo) => {
  const errorConfig = getErrorConfig(errorInfo.code);
  return errorConfig.message;
};

export type ErrorMeta = Record<string, unknown>;
/**
 * Defines error info type. It is the argument passed to the OakError constructor.
 */
export interface ErrorInfo {
  code: ErrorCode;
  originalError?: Error | unknown;
  // Extra data to aid the debug process
  meta?: ErrorMeta;
}

/**
 * Oak Error code structure. This extends Error.
 *
 * @param errorInfo - The error information (code and message).
 * @constructor
 */
class OakError extends Error {
  private errorInfo;

  constructor(errorInfo: ErrorInfo) {
    super(getErrorMessage(errorInfo));
    this.errorInfo = errorInfo;
  }

  /** @returns The error code. */
  public get code(): ErrorCode {
    return this.errorInfo.code;
  }

  /** @returns The error meta data. */
  public get meta(): ErrorMeta | undefined {
    return this.errorInfo.meta;
  }

  /** @returns The original error if present. */
  public get originalError(): Error | unknown {
    return this.errorInfo.originalError;
  }

  /** @returns The error message. */
  public get message(): string {
    return getErrorMessage(this.errorInfo);
  }

  /** @returns The error config (all details for this code, which will include the above, which are left in for convenience). */
  public get config(): ErrorConfig {
    return getErrorConfig(this.code);
  }

  /** @returns The object representation of the error. */
  public toJSON(): object {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export default OakError;
