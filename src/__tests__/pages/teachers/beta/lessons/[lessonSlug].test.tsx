import { GetStaticPropsContext, PreviewData } from "next";

import TeacherPreviewLessonPage, {
  TeacherPreviewLessonPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/beta/lessons/[lessonSlug]";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";

const render = renderWithProviders();

const lesson = lessonOverviewFixture({
  lessonTitle: "Running as a team",
  lessonSlug: "running-as-a-team",
});

describe("TeacherPreviewLessonPage", () => {
  setUseUserReturn(mockLoggedIn);
  it("Renders title from the props", async () => {
    const result = render(<TeacherPreviewLessonPage curriculumData={lesson} />);

    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Running as a team",
    );
  });
});

describe("getStaticProps", () => {
  it("should fetch the correct data", async () => {
    const propsResult = (await getStaticProps({
      params: {
        lessonSlug: "running-as-a-team",
      },
      query: {},
    } as GetStaticPropsContext<URLParams, PreviewData>)) as {
      props: TeacherPreviewLessonPageProps;
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
