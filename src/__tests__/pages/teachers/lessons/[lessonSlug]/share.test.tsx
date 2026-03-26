import { GetStaticPropsContext, PreviewData } from "next";

import LessonShareCanonicalPage, {
  LessonShareCanonicalPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/lessons/[lessonSlug]/share";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { lessonShareCanonicalFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonShare.fixture";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

const lesson = lessonShareCanonicalFixture();
describe("LessonShareCanonicalPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonShareCanonicalPage
        curriculumData={lesson}
        topNav={topNavFixture}
      />,
    );

    expect(result.queryByText("Share")).toBeInTheDocument();
  });

  describe("getStaticProps", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Should fetch the correct data", async () => {
      jest
        .mocked(curriculumApi2023.lessonShare)
        .mockResolvedValueOnce(lessonShareCanonicalFixture());

      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonShareCanonicalPageProps;
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

    it("should throw an error if API is not found", async () => {
      (curriculumApi2023.lessonShare as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });

    it("should return a 404 page if lesson is georestricted or login required", async () => {
      jest.mocked(curriculumApi2023.lessonShare).mockResolvedValueOnce(
        lessonShareCanonicalFixture({
          georestricted: true,
          loginRequired: true,
        }),
      );

      const result = await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          programmeSlug: "math-higher-ks4-l",
          unitSlug: "shakespeare",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>);

      expect(result).toEqual({ notFound: true });
    });

    it("should redirect to the EYFS page when lesson pathway is EYFS", async () => {
      jest.mocked(curriculumApi2023.lessonShare).mockResolvedValueOnce(
        lessonShareCanonicalFixture({
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
