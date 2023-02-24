import { act, screen } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";

import renderWithSeo from "../../../../__helpers__/renderWithSeo";
import { mockSeoResult } from "../../../../__helpers__/cms";
import renderWithProviders from "../../../../__helpers__/renderWithProviders";
import teachersLessonOverviewFixture from "../../../../../node-lib/curriculum-api/fixtures/teachersLessonOverview.fixture";
import LessonOverviewPage, {
  getStaticProps,
  LessonOverviewPageProps,
  URLParams,
} from "../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]";

const props = {
  curriculumData: teachersLessonOverviewFixture({
    videoMuxPlaybackId: "pid-001",
    videoWithSignLanguageMuxPlaybackId: "pid-002",
    hasDownloadableResources: true,
  }),
};

describe("pages/beta/teachers/lessons", () => {
  it("Renders title from the props", async () => {
    renderWithProviders(<LessonOverviewPage {...props} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Islamic Geometry"
    );
  });

  it("renders sign language button if there is a sign language video", async () => {
    renderWithProviders(<LessonOverviewPage {...props} />);

    expect(screen.getByTestId("sign-language-button")).toHaveTextContent(
      "Signed video"
    );
  });

  it("renders Download All button if lesson has downloadable resources", async () => {
    renderWithProviders(<LessonOverviewPage {...props} />);

    expect(screen.getByTestId("download-all-button")).toHaveTextContent(
      "All lesson resources"
    );
  });

  it("sign language button toggles on click", async () => {
    renderWithProviders(<LessonOverviewPage {...props} />);

    const signLanguageButton = screen.getByTestId("sign-language-button");
    act(() => {
      signLanguageButton.click();
    });
    expect(screen.getByTestId("sign-language-button")).toHaveTextContent(
      "Unsigned"
    );
  });

  it("renders an iframe for a presentation and worksheet", async () => {
    const { getAllByRole } = renderWithProviders(
      <LessonOverviewPage {...props} />
    );
    const iframeElement = getAllByRole("iframe");
    expect(iframeElement.length).toEqual(2);
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(<LessonOverviewPage {...props} />);

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Lesson overview | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Overview of lesson",
        ogTitle: "Lesson overview | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Overview of lesson",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
      });
    });
  });
  describe("getServerSideProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          keyStageSlug: "ks2",
          subjectSlug: "english",
          unitSlug: "shakespeare",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonOverviewPageProps;
      };

      expect(propsResult.props.curriculumData.slug).toEqual("macbeth-lesson-1");
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>)
      ).rejects.toThrowError("No context.params");
    });
  });
});
