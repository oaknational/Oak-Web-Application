/**
 * Parse URLSearchParams into a Record<string, string>.
 * Unlike parseDownloadParams for bulk downloads, this does NOT split on commas.
 * Returns single values. Removes empty values.
 * Used for single-asset endpoint where we expect single values, not arrays.
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
