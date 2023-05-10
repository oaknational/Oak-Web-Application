import SearchPage from "../../../pages/beta/teachers/search";
import { mockSeoResult } from "../../__helpers__/cms";
import renderWithSeo from "../../__helpers__/renderWithSeo";

const providers = {
  theme: {},
  menu: {},
  router: {},
  analytics: {},
  cookieConsent: {},
};
const keyStages = [
  {
    slug: "fks1",
    title: "Fake-key-stage 1",
    shortCode: "FKS1",
  },
];

describe("pages/beta/teachers/search.tsx", () => {
  test("renders page with correct seo", () => {
    const { seo } = renderWithSeo(providers)(
      <SearchPage curriculumData={{ keyStages }} />
    );

    expect(seo).toEqual({
      ...mockSeoResult,
      title: "Search for Free Teaching Resources | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Search for Free Teaching Resources",
      ogTitle: "Search for Free Teaching Resources | NEXT_PUBLIC_SEO_APP_NAME",
      ogDescription: "Search for Free Teaching Resources",
      ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      canonical: "NEXT_PUBLIC_SEO_APP_URL",
      robots: "noindex,nofollow",
    });
  });
  test("renders correct key stage filters", () => {
    const { getAllByRole } = renderWithSeo(providers)(
      <SearchPage curriculumData={{ keyStages }} />
    );
    expect(getAllByRole("checkbox", { hidden: true })[0]).toHaveAccessibleName(
      "FKS1 filter"
    );
  });
});
