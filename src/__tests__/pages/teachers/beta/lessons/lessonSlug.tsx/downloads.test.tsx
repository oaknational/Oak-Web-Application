import { GetStaticPropsContext, PreviewData } from "next";

import LessonDownloadsCanonicalPage, {
  LessonDownloadsCanonicalPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/beta/lessons/[lessonSlug]/downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import {
  mockLoggedIn,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

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

  describe("when downloads are region restricted", () => {
    const curriculumData = {
      ...lesson,
      geoRestricted: true,
      pathways: [],
    };

    describe("and the user has access", () => {
      beforeEach(() => {
        setUseUserReturn({
          ...mockLoggedIn,
          user: mockUserWithDownloadAccess,
        });
      });

      it("allows downloads", () => {
        const result = render(
          <LessonDownloadsCanonicalPage curriculumData={curriculumData} />,
        );

        expect(
          result.queryByText(
            "Sorry, downloads for this lesson are not available in your country",
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "transverse-waves",
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonDownloadsCanonicalPageProps;
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
        curriculumApi2023.teachersPreviewLessonDownload as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });
  });
});
