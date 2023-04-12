import { GetServerSidePropsContext, PreviewData } from "next";

import teachersKeyStageSubjectUnitsLessonsFixture from "../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnitLessons.fixture";
import LessonListPage, {
  getServerSideProps,
  LessonListPageProps,
  URLParams,
} from "../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]";
import renderWithProviders from "../../../../../__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("Lesson listing page", () => {
  test("it renders the unit title as page title", () => {
    const { getByRole } = render(
      <LessonListPage
        curriculumData={teachersKeyStageSubjectUnitsLessonsFixture()}
      />
    );

    const pageHeading = getByRole("heading", { level: 1 });

    expect(pageHeading).toBeInTheDocument();
  });

  test("it renders the correct number of lessons", () => {
    const { getByText } = render(
      <LessonListPage
        curriculumData={teachersKeyStageSubjectUnitsLessonsFixture()}
      />
    );

    const lessonCount = getByText("Lessons (2)");

    expect(lessonCount).toBeInTheDocument();
  });
  describe("getServerSideProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getServerSideProps({
        params: {
          subjectSlug: "maths",
          keyStageSlug: "ks4",
          unitSlug: "some-unit-slug",
        },
        query: {},
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: LessonListPageProps;
      };

      expect(propsResult.props.curriculumData).toEqual(
        teachersKeyStageSubjectUnitsLessonsFixture()
      );
    });
    it("should throw error", async () => {
      await expect(
        getServerSideProps(
          {} as GetServerSidePropsContext<URLParams, PreviewData>
        )
      ).rejects.toThrowError("no context.params");
    });
  });
});
