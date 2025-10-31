type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer Rest}`
  ? T extends Lowercase<T>
    ? `${T}${CamelToSnakeCase<Rest>}`
    : `_${Lowercase<T>}${CamelToSnakeCase<Rest>}`
  : S;

export type ConvertKeysToSnakeCase<T> =
  T extends Array<infer U>
    ? Array<ConvertKeysToSnakeCase<U>>
    : T extends object
      ? {
          [K in keyof T as CamelToSnakeCase<
            K & string
          >]: ConvertKeysToSnakeCase<T[K]>;
        }
      : T;

export function convertKeyToSnakeCase(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function convertKeysToSnakeCase<T>(obj: T): ConvertKeysToSnakeCase<T> {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      convertKeysToSnakeCase(item),
    ) as ConvertKeysToSnakeCase<T>;
  } else if (obj && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = convertKeyToSnakeCase(key);
      acc[newKey as keyof typeof acc] = convertKeysToSnakeCase(value);
      return acc;
    }, {} as ConvertKeysToSnakeCase<T>);
  }
  return obj as ConvertKeysToSnakeCase<T>;
}

export default convertKeysToSnakeCase;
