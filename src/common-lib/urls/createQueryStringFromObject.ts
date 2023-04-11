function removeNullOrUndefinedQueryParams<T extends string | string[]>(
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
  search?: Record<string, string | string[] | null | undefined>
) {
  if (!search) {
    return "";
  }
  const searchWithoutNullOrUndefined = removeNullOrUndefinedQueryParams(search);
  return new URLSearchParams(
    Object.entries(searchWithoutNullOrUndefined).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc.push([key, value.toString()]);
      } else {
        acc.push([key, value]);
      }
      return acc;
    }, [] as [string, string][])
  ).toString();
}
