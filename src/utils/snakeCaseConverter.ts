type SnakeToCamelCase<S extends string> = S extends `_${string}`
  ? S
  : S extends `${infer T}_${infer U}${infer Rest}`
    ? `${T}${Uppercase<U>}${SnakeToCamelCase<Rest>}`
    : S;
export type ConvertKeysToCamelCase<T> =
  T extends Array<infer U>
    ? Array<ConvertKeysToCamelCase<U>>
    : T extends object
      ? {
          [K in keyof T as SnakeToCamelCase<
            K & string
          >]: ConvertKeysToCamelCase<T[K]>;
        }
      : T;
export function convertKey(key: string): string {
  if (key.startsWith("_")) return key;
  return key.replace(/_([a-z0-9])/gi, (_, char) => char.toUpperCase());
}
export function keysToCamelCase<T>(obj: T): ConvertKeysToCamelCase<T> {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamelCase) as ConvertKeysToCamelCase<T>;
  }

  if (obj !== null && typeof obj === "object") {
    const entries = Object.entries(obj).map(([key, value]) => [
      convertKey(key),
      keysToCamelCase(value),
    ]);
    return Object.fromEntries(entries) as ConvertKeysToCamelCase<T>;
  }
  return obj as ConvertKeysToCamelCase<T>;
}
export default keysToCamelCase;
