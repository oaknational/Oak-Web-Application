import { GetStaticPropsContext, PreviewData } from "next";

import LessonOverviewCanonicalPage, {
  URLParams,
  getStaticProps,
} from "@/pages/teachers/lessons/[lessonSlug]";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import { LessonOverviewCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

const render = renderWithProviders();

const lesson = lessonOverviewFixture({
  lessonTitle: "The meaning of time",
});

describe("LessonOverviewCanonicalPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonOverviewCanonicalPage
        lesson={{ ...lesson, pathways: [] }}
        isSpecialist={false}
      />,
    );

    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
      lesson.lessonTitle,
    );
  });
});
describe("getStaticProps", () => {
  it("Should fetch the correct data", async () => {
    (
      curriculumApi2023.specialistLessonOverviewCanonical as jest.Mock
    ).mockRejectedValueOnce(new OakError({ code: "curriculum-api/not-found" }));

    const propsResult = (await getStaticProps({
      params: {
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
      },
      query: {},
    } as GetStaticPropsContext<URLParams, PreviewData>)) as {
      props: { lesson: LessonOverviewCanonical; isSpecialist: false };
    };

    expect(propsResult.props.lesson.lessonSlug).toEqual(
      "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
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
  it("should return not found if lesson is not found", async () => {
    (
      curriculumApi2023.specialistLessonOverviewCanonical as jest.Mock
    ).mockRejectedValueOnce(new OakError({ code: "curriculum-api/not-found" }));
    (curriculumApi2023.lessonOverview as jest.Mock).mockRejectedValueOnce(
      new OakError({ code: "curriculum-api/not-found" }),
    );

    const result = await getStaticProps({
      params: {
        lessonSlug: "macbeth-lesson-1",
      },
      query: {},
    } as GetStaticPropsContext<URLParams, PreviewData>);

    expect((result as { notFound: boolean }).notFound).toBe(true);
  });
  it('should throw an error if 2023 api throws an error that is not "curriculum-api/not-found"', async () => {
    (curriculumApi2023.lessonOverview as jest.Mock).mockRejectedValueOnce(
      new Error("Some error"),
    );

    await expect(
      getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
    ).rejects.toThrowError();
  });
});
