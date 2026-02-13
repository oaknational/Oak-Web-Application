/**
 * Parse URLSearchParams for the download endpoint.
 * Splits comma-separated values into arrays and removes empty values.
 */
export function parseDownloadParams(
  searchParams: URLSearchParams,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(
    Object.fromEntries(searchParams.entries()),
  )) {
    if (!value) {
      continue;
    }

    if (value.includes(",")) {
      result[key] = value.split(",");
    } else {
      result[key] = [value];
    }
  }

  return result;
}
