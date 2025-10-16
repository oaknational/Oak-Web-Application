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

  it("should handle URLs with only sid parameters", () => {
    mockRouterAsPath.mockReturnValue("/teachers?sid-abc=123");

    const { container } = renderWithTheme(
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers",
    );
  });

  it("should strip multiple sid parameters from canonical URL", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers?sid-abc=123&page=1&sid-xyz=456&sort=date",
    );

    const { container } = renderWithTheme(
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers?page=1&sort=date",
    );
  });

  it("should strip sid and other parameters to give a clean lesson journey canonical URL", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers/programmes/art-primary-ks1/units/mark-making/lessons?sid-472ca8=y_B0ewmo8Q&sm=0&src=3",
    );

    const { container } = renderWithTheme(
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers/programmes/art-primary-ks1/units/mark-making/lessons",
    );
  });

  it("should not modify URLs without sid, src and sm parameters", () => {
    mockRouterAsPath.mockReturnValue("/teachers/search?q=science&page=2");

    const { container } = renderWithTheme(
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers/search?q=science&page=2",
    );
  });

  it("should remove sm and src parameters from canonical URLs even when sid is absent", () => {
    mockRouterAsPath.mockReturnValue("/teachers?sm=42&src=tracking");

    const { container } = renderWithTheme(
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers",
    );
  });

  it("should handle custom canonicalURL with sid parameters", () => {
    mockRouterAsPath.mockReturnValue("/current-path");

    const { container } = renderWithTheme(
      <Seo
        title="Test Page"
        description="Test description"
        canonicalURL="https://www.thenational.academy/custom-path?sid-abc=123"
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
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers",
    );
  });
});
