export const insightsDocumentLink = (url: URL): string => {
  const tracked = new URL(url);
  if (
    ["http:", "https:"].includes(tracked.protocol) &&
    ["www.thenational.academy", "thenational.academy"].includes(
      tracked.hostname,
    )
  ) {
    tracked.searchParams.set("utm_source", "nc_insights");
    tracked.searchParams.set("utm_medium", "document");
    tracked.searchParams.set("utm_campaign", "CAR");
  }
  return tracked.toString();
};
