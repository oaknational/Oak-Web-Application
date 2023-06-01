import SearchPage from "../../../pages/beta/teachers/search";
import { mockSeoResult } from "../../__helpers__/cms";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import searchPageFixture from "../../../node-lib/curriculum-api/fixtures/searchPage.fixture";

const providers = {
  theme: {},
  menu: {},
  router: {},
  analytics: {},
  cookieConsent: {},
};
const keyStages = searchPageFixture().keyStages;
const subjects = searchPageFixture().subjects;
const contentTypes = searchPageFixture().contentTypes;

describe("pages/beta/teachers/search.tsx", () => {
  test("renders page with correct seo", () => {
    const { seo } = renderWithSeo(providers)(
      <SearchPage curriculumData={{ keyStages, subjects, contentTypes }} />
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
      <SearchPage curriculumData={{ keyStages, subjects, contentTypes }} />
    );
    expect(getAllByRole("checkbox", { hidden: true })[2]).toHaveAccessibleName(
      "KS1 filter"
    );
  });
  test("renders correct subject filters", () => {
    const { getAllByRole } = renderWithSeo(providers)(
      <SearchPage curriculumData={{ keyStages, subjects, contentTypes }} />
    );

    expect(getAllByRole("checkbox", { hidden: true })[7]).toHaveAccessibleName(
      "English filter"
    );
  });
  test("renders correct content type filters", () => {
    const { getAllByRole } = renderWithSeo(providers)(
      <SearchPage curriculumData={{ keyStages, subjects, contentTypes }} />
    );
    expect(getAllByRole("checkbox", { hidden: true })[1]).toHaveAccessibleName(
      "Lessons filter"
    );

    expect(getAllByRole("checkbox", { hidden: true })[0]).toHaveAccessibleName(
      "Units filter"
    );
  });
});
