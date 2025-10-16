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

  it("should fall back to router.asPath when no canonicalURL provided", () => {
    mockRouterAsPath.mockReturnValue(
      "/teachers?sid-abc=123&page=1&sid-xyz=456&sort=date",
    );

    const { container } = renderWithTheme(
      <Seo title="Test Page" description="Test description" />,
    );

    const canonical = container.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://www.thenational.academy/teachers?sid-abc=123&page=1&sid-xyz=456&sort=date",
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
});
