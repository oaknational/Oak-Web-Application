import SearchPage from "../../../pages/beta/teachers/search";
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
    const { seo } = renderWithSeo(
      <SearchPage curriculumData={{ keyStages }} />,
      {
        providers,
      }
    );

    expect(seo).toEqual({
      title: "NEXT_PUBLIC_SEO_APP_NAME",
      description: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
      ogTitle: "NEXT_PUBLIC_SEO_APP_NAME",
      ogDescription: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
      ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
      ogImage:
        "NEXT_PUBLIC_SEO_APP_URLNEXT_PUBLIC_SEO_APP_SOCIAL_SHARING_IMG?2022",
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      canonical: "NEXT_PUBLIC_SEO_APP_URL",
      robots: "noindex,nofollow",
    });
  });
  test("renders correct key stage filters", () => {
    const { getAllByRole } = renderWithSeo(
      <SearchPage curriculumData={{ keyStages }} />,
      { providers }
    );
    expect(getAllByRole("checkbox", { hidden: true })[0]).toHaveAccessibleName(
      "Toggle Fake-key-stage 1 filter"
    );
  });
});
