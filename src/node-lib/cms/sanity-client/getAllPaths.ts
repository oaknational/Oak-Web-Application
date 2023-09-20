import { ObjectPath } from "./resolveSanityReferences";

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !Array.isArray(value) && typeof value === "object" && value !== null;
};
/**
 * Deeply search an object for each value that matches
 * the provided predicate, returning the path for each
 * match as an array
 *
 * @example
 * getAllPaths({foo: [{bar: 'baz'}]}, x => x.bar === 'baz')
 * // => [['foo', '0', 'bar']]
 */

export const getAllPaths = (
  obj: Record<string, unknown> | Record<string, unknown>[],
  pred: (v: unknown) => boolean,
  prev: ObjectPath = []
): ObjectPath[] => {
  const result = [];

  for (const [key, value] of Object.entries(obj)) {
    const path = [...prev, key];

    if (pred(value)) {
      result.push(path);
    } else if (value && (Array.isArray(value) || isRecord(value))) {
      result.push(...getAllPaths(value, pred, path));
    }
  }

  return result;
};
