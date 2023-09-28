import { act, screen } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";

import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/lessonOverview.fixture";
import LessonOverviewPage, {
  getStaticProps,
  LessonOverviewPageProps,
  URLParams,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";

const props = {
  curriculumData: lessonOverviewFixture({
    videoMuxPlaybackId: "pid-001",
    videoWithSignLanguageMuxPlaybackId: "pid-002",
    hasDownloadableResources: true,
  }),
};

const render = renderWithProviders();

describe("pages/teachers/lessons", () => {
  it("Renders title from the props", async () => {
    render(<LessonOverviewPage {...props} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Islamic Geometry",
    );
  });

  it("renders sign language button if there is a sign language video", async () => {
    render(<LessonOverviewPage {...props} />);

    expect(screen.getByText("Show sign language")).toBeInTheDocument();
  });

  it("renders Download All button if lesson has downloadable resources", async () => {
    render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
          hasDownloadableResources: true,
        })}
      />,
    );

    expect(screen.getAllByTestId("download-all-button")[0]).toHaveTextContent(
      "Download all resources",
    );
  });

  it("does not render Download All button if lesson has no downloadable resources", async () => {
    render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
          hasDownloadableResources: false,
          expired: false,
        })}
      />,
    );

    expect(screen.queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("does not render Download All button if lesson is expired", async () => {
    render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
          hasDownloadableResources: false,
          expired: true,
        })}
      />,
    );

    expect(screen.queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("sign language button toggles on click", async () => {
    render(<LessonOverviewPage {...props} />);

    const signLanguageButton = screen.getByText("Show sign language");
    act(() => {
      signLanguageButton.click();
    });
    expect(screen.getByText("Hide sign language")).toBeInTheDocument();
  });

  it("renders an iframe for a presentation, worksheet and additional material", async () => {
    const { getAllByTestId } = render(<LessonOverviewPage {...props} />);
    const iframeElement = getAllByTestId("overview-presentation");
    expect(iframeElement.length).toEqual(3);
  });
  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(<LessonOverviewPage {...props} />);

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Lesson: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Overview of lesson",
        ogTitle:
          "Lesson: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Overview of lesson",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          programmeSlug: "english-primary-ks2-l",
          unitSlug: "shakespeare",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonOverviewPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "macbeth-lesson-1",
      );
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
