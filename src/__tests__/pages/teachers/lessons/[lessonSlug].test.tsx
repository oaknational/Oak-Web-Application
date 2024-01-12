import { GetStaticPropsContext, PreviewData } from "next";

import LessonOverviewCanonicalPage, {
  URLParams,
  getStaticProps,
} from "@/pages/teachers/lessons/[lessonSlug]";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/lessonOverview.fixture";
import { LessonOverviewCanonical } from "@/components/TeacherComponents/lesson.types";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import curriculumApi from "@/node-lib/curriculum-api/__mocks__";

const render = renderWithProviders();

const lesson = lessonOverviewFixture({
  lessonTitle: "The meaning of time",
});
describe("LessonOverviewCanonicalPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonOverviewCanonicalPage lesson={{ ...lesson, pathways: [] }} />,
    );

    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
      lesson.lessonTitle,
    );
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug:
            "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: { lesson: LessonOverviewCanonical };
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

    it("should call legacy api if 2023 throws curriculum-api/not-found error ", async () => {
      (
        curriculumApi2023.lessonOverviewCanonical as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: { lesson: LessonOverviewCanonical };
      };

      expect(curriculumApi.lessonOverviewCanonical).toHaveBeenCalledWith({
        lessonSlug: "macbeth-lesson-1",
      });
      expect(propsResult.props.lesson.lessonSlug).toEqual("macbeth-lesson-1");
    });
    it("should call throw an error if both API's are not found", async () => {
      (
        curriculumApi2023.lessonOverviewCanonical as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (
        curriculumApi.lessonOverviewCanonical as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });
  });
});
