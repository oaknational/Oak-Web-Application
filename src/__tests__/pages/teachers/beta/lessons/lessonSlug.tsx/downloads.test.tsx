import { GetStaticPropsContext, PreviewData } from "next";

import LessonDownloadsPage, {
  LessonDownloadsPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/beta/lessons/[lessonSlug]/downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";

const render = renderWithProviders();

const lesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
});
describe("BetaLessonDownloadsPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonDownloadsPage curriculumData={{ ...lesson }} />,
    );

    expect(result.queryByText("Downloads")).toBeInTheDocument();
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "transverse-waves",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonDownloadsPageProps;
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
