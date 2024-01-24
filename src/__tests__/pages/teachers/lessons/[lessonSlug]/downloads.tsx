import { Mock, expect, vi } from "vitest";
import { GetStaticPropsContext, PreviewData } from "next";

import LessonDownloadsCanonicalPage, {
  LessonDownloadsCanonicalPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/lessons/[lessonSlug]/downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonDownloadsFixture from "@/node-lib/curriculum-api/fixtures/lessonDownloads.fixture";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import curriculumApi from "@/node-lib/curriculum-api/__mocks__";

vi.mock("@/node-lib/curriculum-api-2023");

const render = renderWithProviders();

const lesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
});
describe("LessonDownloadsCanonicalPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonDownloadsCanonicalPage
        curriculumData={{ ...lesson, pathways: [] }}
      />,
    );

    expect(result.queryByText("Downloads")).toBeInTheDocument();
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonDownloadsCanonicalPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "macbeth-lesson-1",
      );
    });
    it("should throw error if no context params", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });

    it("should call legacy api if 2023 throws curriculum-api/not-found error ", async () => {
      (
        curriculumApi2023.lessonDownloadsCanonical as Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonDownloadsCanonicalPageProps;
      };

      expect(curriculumApi.lessonDownloadsCanonical).toHaveBeenCalledWith({
        lessonSlug: "macbeth-lesson-1",
      });
      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "macbeth-lesson-1",
      );
    });
    it("should call throw an error if both API's are not found", async () => {
      (
        curriculumApi2023.lessonDownloadsCanonical as Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (curriculumApi.lessonDownloadsCanonical as Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });
  });
});
