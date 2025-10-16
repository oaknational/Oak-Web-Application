import Seo from "./Seo";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockRouterAsPath = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: mockRouterAsPath(),
  }),
}));

jest.mock("../getBrowserConfig", () => {
  return jest.fn((key: string) => {
    const config: Record<string, string> = {
      seoAppUrl: "https://www.thenational.academy",
      seoAppName: "Oak National Academy",
      seoAppDescription: "Free teaching resources",
      seoAppTwitterHandle: "@oaknational",
      seoAppLocale: "en_GB",
    };
    return config[key];
  });
});

describe("Seo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should use clean canonicalURL when explicitly provided", () => {
    mockRouterAsPath.mockReturnValue("/teachers?sid-abc=123");

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers",
    );
  });

  it("should use clean canonicalURL with preserved query params when provided", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers?sid-abc=123&page=1&sid-xyz=456&sort=date",
    );

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers?page=1&sort=date"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers?page=1&sort=date",
    );
  });

  it("should use clean canonicalURL for lesson journey pages", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers/programmes/art-primary-ks1/units/mark-making/lessons?sid-472ca8=y_B0ewmo8Q&sm=0&src=3",
    );

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers/programmes/art-primary-ks1/units/mark-making/lessons"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers/programmes/art-primary-ks1/units/mark-making/lessons",
    );
  });

  it("should fall back to router.asPath when no canonicalURL provided", () => {
    mockRouterAsPath.mockReturnValue("/teachers/search?q=science&page=2");

    const { container } = renderWithTheme(
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers/search?q=science&page=2",
    );
  });

  it("should use provided canonicalURL over router.asPath", () => {
    mockRouterAsPath.mockReturnValue("/current-path?sm=42&src=tracking");

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/custom-path"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/custom-path",
    );
  });

  it("should trim trailing slashes", () => {
    mockRouterAsPath.mockReturnValue("/teachers/");

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers/"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers",
    );
  });

  it("should preserve learning-theme and year parameters in provided canonicalURL", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers?learning-theme=finance-and-the-economy&year=year-8&sid-abc=123&sm=1",
    );

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers?learning-theme=finance-and-the-economy&year=year-8"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers?learning-theme=finance-and-the-economy&year=year-8",
    );
  });

  it("should preserve search parameters in provided canonicalURL", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers/search?term=romans&keyStages=ks2&curriculum=new&page=2&sid-xyz=456&src=email",
    );

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers/search?term=romans&keyStages=ks2&curriculum=new&page=2"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers/search?term=romans&keyStages=ks2&curriculum=new&page=2",
    );
  });

  it("should preserve curriculum visualiser parameters in provided canonicalURL", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers/curriculum/units?child_subjects=chemistry&tiers=higher&years=10&sid-123=abc&sm=5",
    );

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers/curriculum/units?child_subjects=chemistry&tiers=higher&years=10"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers/curriculum/units?child_subjects=chemistry&tiers=higher&years=10",
    );
  });

  it("should handle canonicalURL with hash fragments", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers/lessons/123?sid-abc=test&page=2#section#subsection",
    );

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/teachers/lessons/123?page=2#section#subsection"
      />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers/lessons/123?page=2#section#subsection",
    );
  });
});
