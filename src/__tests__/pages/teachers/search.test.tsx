import SearchPage from "@/pages/teachers/search";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const providers = {
  theme: {},
  menu: {},
  router: {},
  analytics: {},
  cookieConsent: {},
};
const fixture = searchPageFixture();
if (!fixture) {
  throw new Error("Cannot find search page fixture");
}
const keyStages = fixture.keyStages;
const subjects = fixture.subjects;
const contentTypes = fixture.contentTypes;
const examBoards = fixture.examBoards;

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

describe("pages/teachers/search.tsx", () => {
  test("renders page with correct seo", () => {
    const { seo } = renderWithSeo(providers)(
      <SearchPage
        curriculumData={{ keyStages, subjects, contentTypes, examBoards }}
      />,
    );

    expect(seo).toEqual({
      ...mockSeoResult,
      title: "Search for Free Teaching Resources | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Search for Free Teaching Resources",
      ogTitle: "Search for Free Teaching Resources | NEXT_PUBLIC_SEO_APP_NAME",
      ogDescription: "Search for Free Teaching Resources",
      ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      canonical: "NEXT_PUBLIC_SEO_APP_URL",
      robots: "index,follow",
    });
  });

  test("renders correct examBoard filters", async () => {
    const { getAllByRole } = renderWithSeo(providers)(
      <SearchPage
        curriculumData={{ keyStages, subjects, contentTypes, examBoards }}
      />,
    );

    expect(getAllByRole("checkbox", { hidden: true })[2]).toHaveAttribute(
      "aria-label",
      "AQA filter",
    );
  });
  test("renders correct key stage filters", async () => {
    const { getAllByRole } = renderWithSeo(providers)(
      <SearchPage
        curriculumData={{ keyStages, subjects, contentTypes, examBoards }}
      />,
    );

    expect(getAllByRole("checkbox", { hidden: true })[6]).toHaveAttribute(
      "aria-label",
      "KS1 filter",
    );
  });
  test("renders correct subject filters", () => {
    const { getAllByRole } = renderWithSeo(providers)(
      <SearchPage
        curriculumData={{ keyStages, subjects, contentTypes, examBoards }}
      />,
    );

    expect(getAllByRole("checkbox", { hidden: true })[11]).toHaveAttribute(
      "aria-label",
      "English filter",
    );
  });
  test("renders correct content type filters", () => {
    const { getAllByRole } = renderWithSeo(providers)(
      <SearchPage
        curriculumData={{ keyStages, subjects, contentTypes, examBoards }}
      />,
    );
    expect(getAllByRole("checkbox", { hidden: true })[1]).toHaveAttribute(
      "aria-label",
      "Lessons filter",
    );

    expect(getAllByRole("checkbox", { hidden: true })[0]).toHaveAttribute(
      "aria-label",
      "Units filter",
    );
  });
});
