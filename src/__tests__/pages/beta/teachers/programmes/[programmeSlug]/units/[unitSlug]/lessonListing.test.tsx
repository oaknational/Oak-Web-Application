import { GetServerSidePropsContext, PreviewData } from "next";

import lessonListingFixture from "../../../../../../../../node-lib/curriculum-api/fixtures/lessonListing.fixture";
import LessonListPage, {
  getStaticProps,
  LessonListPageProps,
  URLParams,
} from "../../../../../../../../pages/beta/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import renderWithProviders from "../../../../../../../__helpers__/renderWithProviders";

const render = renderWithProviders();

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
