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
  "misc/import-count": {
    message: "File imported more times than allwoed",
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
  constructor(private errorInfo: ErrorInfo) {
    super(getErrorMessage(errorInfo));
  }

  /** @returns The error code. */
  public get code(): ErrorCode {
    return this.errorInfo.code;
  }

  /** @returns The error meta data. */
  public get meta(): ErrorMeta | undefined {
    return this.errorInfo.meta;
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
