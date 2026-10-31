export function addQueryParamsToUrl(
  url: string,
  queryParams?: {
    years?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  },
) {
  if (!queryParams) {
    return url;
  }
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) {
      searchParams.set(key, value);
    }
  }
  return `${url}?${searchParams.toString()}`;
}

export function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c: string) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
