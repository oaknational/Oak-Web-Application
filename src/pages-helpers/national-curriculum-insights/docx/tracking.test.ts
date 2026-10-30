import { insightsDocumentLink } from "./tracking";

it("tracks Oak links without losing the destination, query or fragment", () => {
  const url = new URL(
    "https://www.thenational.academy/curriculum-change-explained?view=primary#newsletter",
  );
  const result = new URL(insightsDocumentLink(url));
  expect(result.pathname).toBe(url.pathname);
  expect(result.searchParams.get("view")).toBe("primary");
  expect(result.hash).toBe("#newsletter");
  expect(Object.fromEntries(result.searchParams)).toMatchObject({
    utm_source: "nc_insights",
    utm_medium: "document",
    utm_campaign: "CAR",
  });
  expect(url.searchParams.has("utm_source")).toBe(false);
});

it("replaces old campaign values without adding duplicates", () => {
  const result = new URL(
    insightsDocumentLink(
      new URL("https://thenational.academy/?utm_source=old&utm_campaign=old"),
    ),
  );
  expect(result.searchParams.getAll("utm_source")).toEqual(["nc_insights"]);
  expect(result.searchParams.getAll("utm_campaign")).toEqual(["CAR"]);
});

it.each([
  "https://example.org/report?year=2028#summary",
  "https://thenational.academy.example.org/",
  "mailto:help@thenational.academy",
])("leaves non-Oak web links and email unchanged: %s", (href) => {
  expect(insightsDocumentLink(new URL(href))).toBe(href);
});
