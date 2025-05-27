import { GetStaticPropsContext, PreviewData } from "next";
import { act } from "@testing-library/react";

import TeacherPreviewLessonListingPage, {
  LessonListingPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/beta/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonListingFixture, {
  lessonsWithUnpublishedContent,
} from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";

const lessonAccessed = jest.fn();
const teacherShareInitiated = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonAccessed: (...args: []) => lessonAccessed(...args),
      teacherShareInitiated: (...args: []) => teacherShareInitiated(...args),
    },
  }),
}));

const render = renderWithProviders();

const lesson = lessonListingFixture({
  unitSlug: "test-unit-slug",
  unitTitle: "Test Unit",
  programmeSlug: "test-programme-slug",
});

describe("TeacherPreviewLessonPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <TeacherPreviewLessonListingPage curriculumData={lesson} />,
    );

    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Unit",
    );
  });
});

describe("getStaticProps", () => {
  it("should fetch the correct data", async () => {
    const propsResult = (await getStaticProps({
      params: {
        programmeSlug: "test-programme-slug",
        unitSlug: "test-unit-slug",
      },
      query: {},
    } as GetStaticPropsContext<URLParams, PreviewData>)) as {
      props: LessonListingPageProps;
    };

    expect(propsResult.props.curriculumData.unitSlug).toEqual(
      "adding-surds-a57d",
    );
  });

  it("should throw error if no context params", async () => {
    await expect(
      getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
    ).rejects.toThrowError("no context.params");
  });

  it("should throw an error if both API's are not found", async () => {
    (
      curriculumApi2023.teacherPreviewLessonListing as jest.Mock
    ).mockRejectedValueOnce(new OakError({ code: "curriculum-api/not-found" }));
    await expect(
      getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
    ).rejects.toThrowError();
  });
  describe("tracking", () => {
    it("should call lesson accessed when trackLessonSelected is called", async () => {
      const { getByText } = render(
        <TeacherPreviewLessonListingPage
          curriculumData={lessonListingFixture({
            lessons: lessonsWithUnpublishedContent,
          })}
        />,
      );

      const lessonButton = getByText("Add two surds");
      act(() => {
        lessonButton.click();
      });
      expect(lessonAccessed).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "lesson_card",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        examBoard: null,
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessonName: "Add two surds",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "unpublished",
        lessonSlug: "add-two-surds-6wwk0c",
        pathway: null,
        platform: "owa",
        product: "teacher lesson resources",
        tierName: null,
        unitName: "Adding surds",
        unitSlug: "adding-surds-a57d",
        yearGroupName: "Year 10",
        yearGroupSlug: "year-10",
      });
    });
  });
});
