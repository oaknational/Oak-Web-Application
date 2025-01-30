import { GetStaticPropsContext, PreviewData } from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import BetaLessonDownloadsPage, {
  BetaLessonDownloadsPageProps,
  URLParams,
  getStaticProps,
  getStaticPaths,
} from "@/pages/teachers/beta/lessons/[lessonSlug]/downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";

const render = renderWithProviders();

const lesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
});

jest.mock("@/node-lib/isr", () => ({
  shouldSkipInitialBuild: jest.fn(),
  getFallbackBlockingConfig: jest.fn(),
}));

describe("BetaLessonDownloadsPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <BetaLessonDownloadsPage curriculumData={{ ...lesson }} />,
    );

    expect(result.queryByText("Downloads")).toBeInTheDocument();
  });

  describe("getStaticPaths", () => {
    it("returns fallback blocking config when shouldSkipInitialBuild is true", async () => {
      (shouldSkipInitialBuild as unknown as jest.Mock).mockReturnValueOnce(
        true,
      );
      (getFallbackBlockingConfig as jest.Mock).mockReturnValueOnce({
        fallback: "blocking",
        paths: [],
      });

      const result = await getStaticPaths();

      expect(getFallbackBlockingConfig).toHaveBeenCalled();
      expect(result).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });

  describe("getStaticProps", () => {
    beforeEach(() => {
      jest
        .spyOn(curriculumApi2023, "betaLessonDownloadsQuery")
        .mockResolvedValue(lesson);
      jest.resetAllMocks();
    });
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "transverse-waves",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: BetaLessonDownloadsPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "transverse-waves",
      );
    });

    it("should throw error if no context params", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });

    it("should throw an error if API is not found", async () => {
      (
        curriculumApi2023.betaLessonDownloadsQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });
  });
});
