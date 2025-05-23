import { GetStaticPropsContext, PreviewData } from "next";
import { useRouter } from "next/router";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  LessonMediaClipsPageProps,
  getStaticProps,
  getStaticPaths,
  URLParams,
  LessonMediaClipsPage,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/media";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const render = renderWithProviders();

jest.mock("posthog-js/react");

const lessonFixtureData = lessonMediaClipsFixtures();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(() => true),
  useFeatureFlagEnabled: () => false,
}));

jest.mock("@/utils/handleTranscript.ts", () => ({
  populateLessonWithTranscript: jest.fn(),
  populateMediaClipsWithTranscripts: jest.fn(),
}));

jest.mock("@google-cloud/storage", () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({})),
  };
});

describe("LessonMediaClipsPage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      isPreview: false,
      replace: jest.fn(),
      pathname:
        "/teachers/programmes/physical-education/-ks4/units/running-and-jumping/lessons/running-as-a-team/media",
      query: {},
      asPath:
        "/teachers/programmes/physical-education/-ks4/units/running-and-jumping/lessons/running-as-a-team/media",
    });
  });
  it("Renders component", () => {
    const result = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonMediaClipsPage curriculumData={lessonFixtureData} />,
      </OakThemeProvider>,
    );

    expect(result.getByTestId("media-view")).toBeInTheDocument();
  });

  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();

      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "running-as-a-team",
          programmeSlug: "physical-education-ks4",
          unitSlug: "running-and-jumping",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonMediaClipsPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "running-as-a-team",
      );
    });
    it("Should call curriculum api with correct props", async () => {
      await getStaticProps({
        params: {
          lessonSlug: "running-as-a-team",
          programmeSlug: "physical-education-ks4",
          unitSlug: "running-and-jumping",
        },
      });
      expect(curriculumApi.lessonMediaClips).toHaveBeenCalledWith({
        lessonSlug: "running-as-a-team",
        programmeSlug: "physical-education-ks4",
        unitSlug: "running-and-jumping",
      });
    });
    it("should return notFound when a landing page is missing", async () => {
      (curriculumApi.lessonMediaClips as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      const context = {
        params: {
          lessonSlug: "running-as-a-team",
          programmeSlug: "physical-education-ks4",
          unitSlug: "running-and-jumping",
        },
      };
      const response = await getStaticProps(context);
      expect(response).toEqual({
        notFound: true,
      });
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
