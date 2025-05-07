/**
 * Inspired in part by Firebase error handling
 * @see https://github.com/firebase/firebase-admin-node/blob/7ce2345d716697d743e0234e7d45446ca11bc1da/src/utils/error.ts
 */

const ERROR_CODES = [
  "misc/unknown",
  "misc/network-error",
  "misc/unexpected-type",
  "misc/import-count",
  "search/unknown",
  "hubspot/invalid-email",
  "hubspot/unknown",
  "video/unknown",
  "video/persistent-unknown",
  "video/fetch-signed-token",
  "hubspot/not-loaded",
  "hubspot/script-failed-to-load",
  "hubspot/lost-information",
  "hubspot/identify-no-email",
  "preview/invalid-token",
  "preview/zod-error",
  "cms/invalid-reference-data",
  "cms/invalid-hubspot-form",
  "getRefreshedMVTime/params-incorrect",
  "curriculum-api/not-found",
  "curriculum-api/uniqueness-assumption-violated",
  "curriculum-api/internal-error",
  "curriculum-api/params-incorrect",
  "school-picker/fetch-suggestions",
  "urls/failed-to-resolve",
  "downloads/failed-to-fetch",
  "downloads/check-files-failed",
  "onboarding/request-error",
  "oak-components/invalid-icon-name",
  "educator-api/failed-to-fetch",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

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
  "video/persistent-unknown": {
    message: "Sorry this video couldn't play persistently, please try again",
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
  "preview/zod-error": {
    message: "Zod error parsing preview data from CMS",
    responseStatusCode: 500,
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
  "getRefreshedMVTime/params-incorrect": {
    message: "The params provided are incorrect",
    shouldNotify: true,
    responseStatusCode: 404,
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
  "curriculum-api/params-incorrect": {
    message: "The params provided are incorrect",
    shouldNotify: true,
    responseStatusCode: 404,
  },
  "curriculum-api/internal-error": {
    message: "Internal error in the curriculum API",
    shouldNotify: true,
    responseStatusCode: 500,
  },
  "school-picker/fetch-suggestions": {
    message: "Error fetching suggested schools list",
    shouldNotify: true,
  },
  "urls/failed-to-resolve": {
    message:
      "Failed to resolve URL. Likely caused by either an empty param (e.g. slug) or a mismatch between the TS types and the pathPattern",
    shouldNotify: true,
  },
  "downloads/failed-to-fetch": {
    message: "Failed to fetch downloads",
    shouldNotify: true,
  },
  "downloads/check-files-failed": {
    message: "Failed to check file existence",
    shouldNotify: true,
  },
  "onboarding/request-error": {
    message: "Onboarding request failed",
    shouldNotify: true,
  },
  "oak-components/invalid-icon-name": {
    message: "Invalid icon name provided to OakIcon",
    shouldNotify: true,
  },
  "educator-api/failed-to-fetch": {
    message: "Failed to fetch data from the educator API",
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
 * Recursively parse the error metadata and remove any sensitive values that can reasonably be removed.
 * @param errorInfo
 *
 * @returns The error info with sensitive values removed.
 */
export function removeSensitiveValues(errorInfo: ErrorInfo): ErrorInfo {
  function recursiveStringReplace(
    obj: Record<string, unknown> | undefined,
  ): Record<string, unknown> {
    function replacer(value: unknown): typeof value {
      if (typeof value === "string") {
        const piiPatterns = [
          // email
          /[^@\s]+@[^@\s]+/g,
        ];
        if (piiPatterns.some((pattern) => pattern.test(value))) {
          return "[REDACTED]";
        }
        return value;
      }
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Recursively remove sensitive data from any nested objects
        return recursiveStringReplace(value as Record<string, unknown>);
      }
      return value;
    }
    const newObj = {} as Record<string, unknown>;
    for (const key in obj) {
      newObj[key] = replacer(obj[key]);
    }
    return newObj;
  }
  // If there is no metadata to sanitise, return the original error info.
  if (!errorInfo.meta) {
    return errorInfo;
  }
  const safeMeta = recursiveStringReplace(errorInfo.meta);
  return {
    ...errorInfo,
    meta: safeMeta,
  };
}

/**
 * Oak Error code structure. This extends Error.
 *
 * @param errorInfo - The error information (code and message).
 * @constructor
 */
class OakError extends Error {
  private errorInfo;
  private _hasBeenReported = false;

  constructor(errorInfo: ErrorInfo) {
    // Remove any sensitive values in the meta data.
    const safeErrorInfo: ErrorInfo = removeSensitiveValues(errorInfo);

    super(getErrorMessage(safeErrorInfo));
    this.errorInfo = safeErrorInfo;
    if (
      errorInfo.originalError instanceof OakError &&
      errorInfo.originalError.hasBeenReported
    ) {
      this.hasBeenReported = true;
    }
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

  public set hasBeenReported(x: boolean) {
    this._hasBeenReported = x;
  }

  public get hasBeenReported() {
    return this._hasBeenReported;
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
