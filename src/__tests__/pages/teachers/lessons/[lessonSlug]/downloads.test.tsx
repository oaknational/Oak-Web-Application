import { GetStaticPropsContext, PreviewData } from "next";

import LessonDownloadsCanonicalPage, {
  LessonDownloadsCanonicalPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/lessons/[lessonSlug]/downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { lessonDownloadsCanonicalFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import {
  mockLoggedIn,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

const lesson = lessonDownloadsCanonicalFixture({
  lessonTitle: "The meaning of time",
});
describe("LessonDownloadsCanonicalPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonDownloadsCanonicalPage
        topNav={topNavFixture}
        curriculumData={lesson}
      />,
    );

    expect(result.queryByText("Downloads")).toBeInTheDocument();
  });

  describe("when downloads are region restricted", () => {
    const curriculumData = {
      ...lesson,
      geoRestricted: true,
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
          <LessonDownloadsCanonicalPage
            curriculumData={curriculumData}
            topNav={topNavFixture}
          />,
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
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Should fetch the correct data", async () => {
      jest
        .mocked(curriculumApi2023.lessonDownloads)
        .mockResolvedValueOnce(lessonDownloadsCanonicalFixture());

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
      (curriculumApi2023.lessonDownloads as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });

    it("should redirect to the EYFS page when lesson pathway is EYFS", async () => {
      jest.mocked(curriculumApi2023.lessonDownloads).mockResolvedValueOnce(
        lessonDownloadsCanonicalFixture({
          pathways: [
            {
              programmeSlug: "eyfs-communication-and-language",
              unitSlug: "unit-slug",
              unitTitle: "Unit title",
              keyStageSlug: "early-years-foundation-stage",
              keyStageTitle: "Early Years Foundation Stage",
              subjectSlug: "communication-and-language",
              subjectTitle: "Communication and language",
            },
          ],
        }),
      );

      const result = await getStaticProps({
        params: {
          lessonSlug: "eyfs-lesson-slug",
          programmeSlug: "eyfs-programme",
          unitSlug: "eyfs-unit",
        },
      });

      expect(result).toEqual({
        redirect: {
          destination: "/teachers/eyfs/communication-and-language",
          statusCode: 301,
        },
      });
    });
  });
});
