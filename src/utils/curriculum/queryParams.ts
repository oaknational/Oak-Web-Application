export function generateQueryParams(
  params: Record<string, string | number | boolean>,
) {
  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlSearchParams.append(key, value.toString());
  });
  return urlSearchParams;
}
