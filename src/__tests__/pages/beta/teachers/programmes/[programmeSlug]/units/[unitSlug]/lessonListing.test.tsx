import { GetServerSidePropsContext, PreviewData } from "next";

import lessonListingFixture from "../../../../../../../../node-lib/curriculum-api/fixtures/lessonListing.fixture";
import LessonListPage, {
  getStaticProps,
  LessonListPageProps,
  URLParams,
} from "../../../../../../../../pages/beta/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import renderWithProviders from "../../../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../../../__helpers__/renderWithSeo";
import { mockSeoResult } from "../../../../../../../__helpers__/cms";
const render = renderWithProviders();

const utilsMock = jest.requireMock(
  "../../../../../../../../utils/resultsPerPage"
);
jest.mock("../../../../../../../../utils/resultsPerPage", () => ({
  RESULTS_PER_PAGE: 20,
}));

describe("Lesson listing page", () => {
  test("it renders the unit title as page title", () => {
    const { getByRole } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />
    );

    const pageHeading = getByRole("heading", { level: 1 });

    expect(pageHeading).toBeInTheDocument();
  });

  test("it renders the correct number of lessons", () => {
    const { getByText } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />
    );

    const lessonCount = getByText("Lessons (3)");

    expect(lessonCount).toBeInTheDocument();
  });
  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <LessonListPage curriculumData={lessonListingFixture()} />
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Unit: Adding surds | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Lessons in Unit",
        ogTitle: "Unit: Adding surds | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Lessons in Unit",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
    it("renders the correct SEO details with pagination", async () => {
      utilsMock.RESULTS_PER_PAGE = 2;
      const { seo } = renderWithSeo()(
        <LessonListPage curriculumData={lessonListingFixture()} />
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Unit: Adding surds | KS4 Maths | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Lessons in Unit",
        ogTitle:
          "Unit: Adding surds | KS4 Maths | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Lessons in Unit",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });
  describe("getServerSideProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          programmeSlug: "maths-secondary-ks4-higher",
          unitSlug: "adding-surds-a57d",
        },
        query: {},
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: LessonListPageProps;
      };

      expect(propsResult.props.curriculumData).toEqual(lessonListingFixture());
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetServerSidePropsContext<URLParams, PreviewData>)
      ).rejects.toThrowError("no context.params");
    });
  });
});
