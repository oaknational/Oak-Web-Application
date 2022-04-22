/**
 * Inspired in part by Firebase error handling
 * @see https://github.com/firebase/firebase-admin-node/blob/7ce2345d716697d743e0234e7d45446ca11bc1da/src/utils/error.ts
 */

const ERROR_CODES = [
  "misc/unknown",
  "auth/token-expired",
  "auth/token-error-unknown",
  "graphql/validation", // for this we actually want more details when the error is thrown
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
};

const getErrorConfig = (code: ErrorCode) => errorConfigs[code];

export const getErrorMessage = (errorInfo: ErrorInfo) => {
  const errorConfig = getErrorConfig(errorInfo.code);
  return errorConfig.message;
};

type ErrorMeta = Record<string, unknown>;
/**
 * Defines error info type. It is the argument passed to the OakError constructor.
 */
export interface ErrorInfo {
  code: ErrorCode;
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
