import { GetStaticPropsContext, PreviewData } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  getStaticProps,
  URLParams,
  CanonicalLessonMediaClipsPageProps,
  CanonicalLessonMediaClipsPage,
} from "@/pages/teachers/lessons/[lessonSlug]/media";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";

const render = renderWithProviders();

jest.mock("posthog-js/react");

const mediaClips = lessonMediaClipsFixtures().mediaClips;

const fixtureData = {
  lessonSlug: "running-as-a-team",
  lessonTitle: "Running as a team",
  subjectTitle: "Physical Education",
  keyStageTitle: "Key stage 4",
  mediaClips,
  pathways: [
    {
      programmeSlug: "physical-education-ks4",
      lessonSlug: "running-and-jumping",
      lessonTitle: "Running and jumping",
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      unitSlug: "running-and-jumping",
      unitTitle: "Running and jumping",
      subjectSlug: "physical-education",
      subjectTitle: "Physical Education",
    },
  ],
};

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(() => true),
}));

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
  it("Renders breadcrumbs", async () => {
    const result = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <CanonicalLessonMediaClipsPage curriculumData={fixtureData} />,
      </OakThemeProvider>,
    );

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
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
  });
});
