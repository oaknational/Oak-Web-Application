import { generateUrl } from "./generateUrl";

describe("generateUrl", () => {
  const originalUrl =
    "http://example.com/teachers/programmes/someProgramme/units?someParam=someValue";
  const originalState = { url: originalUrl };

  beforeEach(() => {
    jest.spyOn(window.history, "state", "get").mockReturnValue(originalState);

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { origin: "http://example.com" },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate URL with learning-theme when yearGroupSlug or categorySlug is provided and theme.slug is not "all"', () => {
    const url =
      "http://example.com/teachers/programmes/someProgramme/units?someParam=someValue";
    Object.defineProperty(window, "location", {
      value: new URL(url),
    });
    const theme = { slug: "math" };
    const programmeSlug = "someProgramme";
    const yearGroupSlug = "year1";
    const newUrl = generateUrl(theme, programmeSlug, yearGroupSlug);

    expect(newUrl).toBe(`${url}&learning-theme=math`);
  });

  it('should generate URL without learning-theme when yearGroupSlug or categorySlug is provided and theme.slug is "all"', () => {
    const url =
      "http://example.com/teachers/programmes/someProgramme/units?someParam=someValue";
    Object.defineProperty(window, "location", {
      value: new URL(url),
    });
    const theme = { slug: "all" };
    const programmeSlug = "someProgramme";
    const yearGroupSlug = "year1";
    const newUrl = generateUrl(theme, programmeSlug, yearGroupSlug);

    expect(newUrl).toBe(url);
  });

  it('should generate URL with learning-theme when neither yearGroupSlug nor categorySlug is provided and theme.slug is not "all"', () => {
    const theme = { slug: "math" };
    const programmeSlug = "someProgramme";
    const newUrl = generateUrl(theme, programmeSlug);

    expect(newUrl).toBe(
      "http://example.com/teachers/programmes/someProgramme/units?learning-theme=math",
    );
  });

  it('should generate base URL when neither yearGroupSlug nor categorySlug is provided and theme.slug is "all"', () => {
    const theme = { slug: "all" };
    const programmeSlug = "someProgramme";
    const newUrl = generateUrl(theme, programmeSlug);

    expect(newUrl).toBe(
      "http://example.com/teachers/programmes/someProgramme/units",
    );
  });
});
