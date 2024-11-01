import { GetStaticPropsContext, PreviewData } from "next";

import TeacherPreviewLessonPage, {
  URLParams,
  getStaticProps,
} from "@/pages/teachers/beta/lessons/[lessonSlug]";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

const render = renderWithProviders();

const lesson = lessonOverviewFixture({
  lessonTitle: "Running as a team",
  lessonSlug: "running-as-a-team",
});

// duplicates lesson overview tests
describe("TeacherPreviewLessonPage", () => {
  it("Renders title from the props", async () => {
    const result = render(<TeacherPreviewLessonPage curriculumData={lesson} />);

    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Running as a team",
    );
  });
});

describe("getStaticProps", () => {
  it.skip("should fetch the correct data", async () => {
    (curriculumApi2023.teacherPreviewLesson as jest.Mock).mockRejectedValueOnce(
      new OakError({ code: "curriculum-api/not-found" }),
    );

    const propsResult = (await getStaticProps({
      params: {
        lessonSlug: "running-as-a-team",
      },
      query: {},
    } as GetStaticPropsContext<URLParams, PreviewData>)) as {
      props: { curriculumData: LessonOverviewPageData };
    };

    expect(propsResult.props.curriculumData.lessonSlug).toEqual(
      "running-as-a-team",
    );
  });

  it("should throw error if no context params", async () => {
    await expect(
      getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
    ).rejects.toThrowError("No context.params");
  });
  it("should throw an error if both API's are not found", async () => {
    (curriculumApi2023.lessonOverview as jest.Mock).mockRejectedValueOnce(
      new OakError({ code: "curriculum-api/not-found" }),
    );
    await expect(
      getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
    ).rejects.toThrowError();
  });
});
