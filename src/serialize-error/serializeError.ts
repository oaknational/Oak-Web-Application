import { Primitive, JsonObject } from "type-fest";

export type ErrorObject = {
  name?: string;
  message?: string;
  stack?: string;
  cause?: unknown;
  code?: string;
} & JsonObject;

export type ErrorLike = {
  [key: string]: unknown;
  name: string;
  message: string;
  stack: string;
  cause?: unknown;
  code?: string;
};

export interface Options {
  /**
	The maximum depth of properties to preserve when serializing/deserializing.
	@default Number.POSITIVE_INFINITY
	@example
	```
	import {serializeError} from 'serialize-error';
	const error = new Error('🦄');
	error.one = {two: {three: {}}};
	console.log(serializeError(error, {maxDepth: 1}));
	//=> {name: 'Error', message: '…', one: {}}
	console.log(serializeError(error, {maxDepth: 2}));
	//=> {name: 'Error', message: '…', one: { two: {}}}
	```
	*/
  readonly maxDepth?: number;

  /**
	Indicate whether to use a `.toJSON()` method if encountered in the object. This is useful when a custom error implements its own serialization logic via `.toJSON()` but you prefer to not use it.
	@default true
	*/
  readonly useToJSON?: boolean;
}

export class NonError extends Error {
  name = "NonError";

  constructor(message: string) {
    super(NonError._prepareSuperMessage(message));
  }

  static _prepareSuperMessage(message: string) {
    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }
}

const commonProperties = [
  {
    property: "name",
    enumerable: false,
  },
  {
    property: "message",
    enumerable: false,
  },
  {
    property: "stack",
    enumerable: false,
  },
  {
    property: "code",
    enumerable: true,
  },
  {
    property: "cause",
    enumerable: false,
  },
];

const toJsonWasCalled = Symbol(".toJSON was called");

const toJSON = (from) => {
  from[toJsonWasCalled] = true;
  const json = from.toJSON();
  delete from[toJsonWasCalled];
  return json;
};

const destroyCircular = ({
  from,
  seen,
  to_,
  forceEnumerable,
  maxDepth,
  depth,
  useToJSON,
}) => {
  const to = to_ || (Array.isArray(from) ? [] : {});

  seen.push(from);

  if (depth >= maxDepth) {
    return to;
  }

  if (
    useToJSON &&
    typeof from.toJSON === "function" &&
    from[toJsonWasCalled] !== true
  ) {
    return toJSON(from);
  }

  const destroyLocal = (value) =>
    destroyCircular({
      from: value,
      seen: [...seen],
      to_: isErrorLike(value) ? new Error() : undefined,
      forceEnumerable,
      maxDepth,
      depth,
      useToJSON,
    });

  for (const [key, value] of Object.entries(from)) {
    if (typeof Buffer === "function" && Buffer.isBuffer(value)) {
      to[key] = "[object Buffer]";
      continue;
    }

    // TODO: Use `stream.isReadable()` when targeting Node.js 18.
    if (
      value !== null &&
      typeof value === "object" &&
      typeof value.pipe === "function"
    ) {
      to[key] = "[object Stream]";
      continue;
    }

    if (typeof value === "function") {
      continue;
    }

    if (!value || typeof value !== "object") {
      to[key] = value;
      continue;
    }

    if (!seen.includes(from[key])) {
      depth++;
      to[key] = destroyLocal(from[key]);

      continue;
    }

    to[key] = "[Circular]";
  }

  for (const { property, enumerable } of commonProperties) {
    if (typeof from[property] !== "undefined" && from[property] !== null) {
      Object.defineProperty(to, property, {
        value: isErrorLike(from[property])
          ? destroyLocal(from[property])
          : from[property],
        enumerable: forceEnumerable ? true : enumerable,
        configurable: true,
        writable: true,
      });
    }
  }

  return to;
};

// export function serializeError<ErrorType>(error: ErrorType, options?: Options): ErrorType extends Primitive
// 	? ErrorType

export const serializeError = <ErrorType>(
  error: ErrorType,
  options: Options = {}
): ErrorType => {
  const { maxDepth = Number.POSITIVE_INFINITY, useToJSON = true } = options;

  if (typeof error === "object" && error !== null) {
    return destroyCircular({
      from: error,
      seen: [],
      forceEnumerable: true,
      maxDepth,
      depth: 0,
      useToJSON,
    });
  }

  // People sometimes throw things besides Error objects…
  if (typeof error === "function") {
    // `JSON.stringify()` discards functions. We do too, unless a function is thrown directly.
    return `[Function: ${error.name || "anonymous"}]`;
  }

  return error;
};

export function deserializeError(
  errorObject: ErrorObject | unknown,
  options?: Options
): Error;
export function deserializeError(
  errorObject: ErrorObject | unknown,
  options?: Options
) {
  const { maxDepth = Number.POSITIVE_INFINITY } = options;

  if (errorObject instanceof Error) {
    return errorObject;
  }

  if (
    typeof errorObject === "object" &&
    errorObject !== null &&
    !Array.isArray(errorObject)
  ) {
    return destroyCircular({
      from: errorObject,
      seen: [],
      // eslint-disable-next-line unicorn/error-message
      to_: new Error(),
      maxDepth,
      depth: 0,
    });
  }

  return new NonError(errorObject);
}

export function isErrorLike(value: unknown) {
  return Boolean(
    value &&
      typeof value === "object" &&
      "name" in value &&
      "message" in value &&
      "stack" in value
  );
}
