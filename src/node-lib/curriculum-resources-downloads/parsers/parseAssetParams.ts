/**
 * Parse URLSearchParams into a Record<string, string>.
 * Unlike parseParams for bulk downloads, this does NOT split on commas.
 * Returns single values. Removes empty values.
 * Used for single-asset endpoint where we expect single values, not arrays.
 * Required for individual asset endpoint.
 */
export const parseAssetParams = (searchParams: URLSearchParams) => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(
    Object.fromEntries(searchParams.entries()),
  )) {
    if (value) {
      result[key] = value;
    }
  }

  return result;
};
