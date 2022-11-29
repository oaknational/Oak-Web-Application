function removeNullOrUndefinedQueryParams<T>(
  search: Record<string, T | null | undefined>
): Record<string, T> {
  const transformed = Object.entries(search).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }

    return acc;
  }, {} as Record<string, T>);

  return transformed;
}

export default function createQueryStringFromObject(
  search: Record<string, string | null | undefined>
) {
  const searchWithoutNullOrUndefined = removeNullOrUndefinedQueryParams(search);
  return new URLSearchParams(searchWithoutNullOrUndefined).toString();
}
