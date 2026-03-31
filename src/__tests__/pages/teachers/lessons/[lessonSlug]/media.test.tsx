import { GetStaticPropsContext, PreviewData } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { lessonMediaClipsCanonicalFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  getStaticProps,
  URLParams,
  CanonicalLessonMediaClipsPageProps,
  CanonicalLessonMediaClipsPage,
} from "@/pages/teachers/lessons/[lessonSlug]/media";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

jest.mock("@/utils/handleTranscript.ts", () => ({
  populateLessonWithTranscript: jest.fn(),
  populateMediaClipsWithTranscripts: jest.fn(),
}));

const fixtureData = lessonMediaClipsCanonicalFixture({
  lessonTitle: "Running as a team",
  lessonReleaseDate: "2022-02-01T00:00:00Z",
});

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(() => true),
  useFeatureFlagEnabled: () => false,
}));

jest.mock("@google-cloud/storage", () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({})),
  };
});

describe("LessonMediaClipsCanonicalPage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      isPreview: false,
      replace: jest.fn(),
      pathname: "/teachers/lessons/running-as-a-team/media",
      query: {},
      asPath: "/teachers/lessons/running-as-a-team/media",
    });
  });

  it("Renders component", async () => {
    const result = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <CanonicalLessonMediaClipsPage
          curriculumData={fixtureData}
          topNav={topNavFixture}
        />
        ,
      </OakThemeProvider>,
    );

    expect(result.getByTestId("media-view")).toBeInTheDocument();
  });

  describe("getStaticProps", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Should fetch the correct data", async () => {
      jest
        .mocked(curriculumApi2023.lessonMediaClips)
        .mockResolvedValueOnce(lessonMediaClipsCanonicalFixture());

      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "running-as-a-team",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: CanonicalLessonMediaClipsPageProps;
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

    it("should throw an error if API is not found", async () => {
      (curriculumApi2023.lessonShare as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });

    it("should redirect to the EYFS page when lesson pathway is EYFS", async () => {
      jest.mocked(curriculumApi2023.lessonMediaClips).mockResolvedValueOnce(
        lessonMediaClipsCanonicalFixture({
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
