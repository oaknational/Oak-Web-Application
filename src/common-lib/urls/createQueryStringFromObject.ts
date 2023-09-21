export type UrlQueryObject = Record<
  string,
  string | string[] | null | undefined
>;

function removeNullOrUndefinedQueryParams<T extends string | string[]>(
  search: Record<string, T | null | undefined>,
): Record<string, T> {
  const transformed = Object.entries(search).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }

      return acc;
    },
    {} as Record<string, T>,
  );

  return transformed;
}

/**
 * Transforms an object to a URLSearchParams string.
 * Strips out nulls, undefineds, and empty arrays.
 * Comma-separates arrays e.g. ["one", "two"] -> "one,two".
 */
export default function createQueryStringFromObject(search?: UrlQueryObject) {
  if (!search) {
    return "";
  }
  const searchWithoutNullOrUndefined = removeNullOrUndefinedQueryParams(search);
  return new URLSearchParams(
    Object.entries(searchWithoutNullOrUndefined).reduce(
      (acc, [key, value]) => {
        const valueStr = Array.isArray(value) ? value.toString() : value;
        if (valueStr) {
          acc.push([key, valueStr]);
        }
        return acc;
      },
      [] as [string, string][],
    ),
  ).toString();
}
