import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import EarlyReleaseUnits from "@/pages/beta/teachers-2023/early-release-units";

const providers = {
  theme: {},
  menu: {},
  router: {},
  analytics: {},
  cookieConsent: {},
};

describe("pages/beta/teachers-2023/early-release-units", () => {
  test("renders page with correct seo", () => {
    const { seo } = renderWithSeo(providers)(<EarlyReleaseUnits />);

    expect(seo).toEqual({
      ...mockSeoResult,
      title: "NEXT_PUBLIC_SEO_APP_NAME",
      description: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
      ogTitle: "NEXT_PUBLIC_SEO_APP_NAME",
      ogDescription: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
      ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      canonical: "NEXT_PUBLIC_SEO_APP_URL",
      robots: "noindex,nofollow",
    });
  });
});
