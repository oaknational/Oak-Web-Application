import { GetStaticPropsContext, PreviewData } from "next";
import { useRouter } from "next/router";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  getStaticProps,
  getStaticPaths,
  URLParams,
} from "@/pages/teachers/beta/lessons/[lessonSlug]/media";
import { LessonMediaClipsPage } from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/media";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { CanonicalLessonMediaClipsPageProps } from "@/pages/teachers/lessons/[lessonSlug]/media";

const render = renderWithProviders();

const lessonFixtureData = lessonMediaClipsFixtures();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@google-cloud/storage", () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({})),
  };
});

describe("BetaLessonMediaClipsPage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      isPreview: false,
      replace: jest.fn(),
      pathname: "/teachers/beta/lessons/running-as-a-team/media",
      query: {},
      asPath: "/teachers/beta/lessons/running-as-a-team/media",
    });
  });

  it.skip("Renders breadcrumbs", async () => {
    const result = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonMediaClipsPage curriculumData={lessonFixtureData} />,
      </OakThemeProvider>,
    );

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
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
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: CanonicalLessonMediaClipsPageProps;
      };
      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "running-as-a-team",
      );
    });
    it("Should call curriculum api with correct props", async () => {
      await getStaticProps({
        params: {
          lessonSlug: "running-as-a-team",
        },
      });
      expect(curriculumApi.betaLessonMediaClipsQuery).toHaveBeenCalledWith({
        lessonSlug: "running-as-a-team",
      });
    });
    it("should return notFound when a landing page is missing", async () => {
      (
        curriculumApi.betaLessonMediaClipsQuery as jest.Mock
      ).mockResolvedValueOnce(undefined);

      const context = {
        params: {
          lessonSlug: "running-as-a-team",
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
