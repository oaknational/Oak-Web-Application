/**
 *
 * Functions to narrow types to a union of strings or numbers
 *
 */

// T must be composed of primitive types
export const isInUnion = <T extends string | number>(
  candidate: string | number,
  values: T[],
): candidate is T => values.find((value) => value === candidate) !== undefined;

export const throwIfNotInUnion = <T extends string | number>(
  candidate: string | number | null | undefined,
  values: T[],
): void => {
  if (!candidate) {
    throw new Error(`Value is null or undefined`);
  }
  if (!isInUnion(candidate, values)) {
    throw new Error(`Value ${candidate} not in ${values}`);
  }
};

export const unionOrNull = <T extends string | number>(
  candidate: string | number | null | undefined,
  values: T[],
): T | null => {
  if (!candidate) {
    return null;
  }
  return isInUnion(candidate, values) ? candidate : null;
};
