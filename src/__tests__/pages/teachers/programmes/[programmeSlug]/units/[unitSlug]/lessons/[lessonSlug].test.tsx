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
import { LEGACY_COHORT, NEW_COHORT } from "@/config/cohort";

const props = {
  curriculumData: lessonOverviewFixture({
    videoMuxPlaybackId: "pid-001",
    videoWithSignLanguageMuxPlaybackId: "pid-002",
    hasDownloadableResources: true,
  }),
};

const propsWithTier = {
  curriculumData: lessonOverviewFixture({
    tierTitle: "Higher",
  }),
};
const propsWithExamBoard = {
  curriculumData: lessonOverviewFixture({
    examBoardTitle: "AQA",
  }),
};
const propsWithTierAndExamBoard = {
  curriculumData: lessonOverviewFixture({
    tierTitle: "Higher",
    examBoardTitle: "AQA",
  }),
};

const downloadResourceButtonClicked = jest.fn();
const lessonShareStarted = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      downloadResourceButtonClicked: (...args: []) =>
        downloadResourceButtonClicked(...args),
      lessonShareStarted: (...args: []) => lessonShareStarted(...args),
    },
  }),
}));

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

  it("share button is not disabled with legacy content (lessonCohort is null)", () => {
    const { queryAllByTestId, queryAllByText } = render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
          hasDownloadableResources: false,
          expired: false,
          lessonCohort: null,
        })}
      />,
    );

    const shareButton = queryAllByTestId("share-all-button");
    const shareLabel = queryAllByText("Share activities with pupils");

    if (shareButton[0] !== undefined && shareButton.length > 0) {
      expect(shareButton[0]).not.toHaveAttribute("disabled");
      expect(shareLabel[0]).toBeInTheDocument();
    } else {
      throw new Error("Share all button not found");
    }
  });
  it("share button is not disabled with non legacy content (lesson cohort is the same as legacy cohort)", () => {
    const { queryAllByTestId, queryAllByText } = render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
          hasDownloadableResources: false,
          expired: false,
          lessonCohort: LEGACY_COHORT,
        })}
      />,
    );

    const shareButton = queryAllByTestId("share-all-button");
    const shareLabel = queryAllByText("Share activities with pupils");

    if (shareButton[0] !== undefined && shareButton.length > 0) {
      expect(shareButton[0]).not.toHaveAttribute("disabled");
      expect(shareLabel[0]).toBeInTheDocument();
    } else {
      throw new Error("Share all button not found");
    }
  });
  it("share button is  disabled with non legacy content", () => {
    const { queryAllByTestId, queryAllByText } = render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
          hasDownloadableResources: false,
          expired: true,
          lessonCohort: NEW_COHORT,
        })}
      />,
    );

    const shareButton = queryAllByTestId("share-all-button");
    const shareLabel = queryAllByText("Share activities with pupils");

    if (shareButton[0] !== undefined && shareButton.length > 0) {
      expect(shareButton[0]).toHaveAttribute("disabled");
      expect(shareLabel[0]).toBeInTheDocument();
    } else {
      throw new Error("Share all button not found");
    }
  });

  it("sign language button toggles on click", async () => {
    render(<LessonOverviewPage {...props} />);

    const signLanguageButton = screen.getByText("Show sign language");
    act(() => {
      signLanguageButton.click();
    });
    expect(screen.getByText("Hide sign language")).toBeInTheDocument();
  });

  it("renders an iframe for a presentation and worksheet", async () => {
    const { getAllByTestId } = render(<LessonOverviewPage {...props} />);
    const iframeElement = getAllByTestId("overview-presentation");
    expect(iframeElement.length).toEqual(2);
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(<LessonOverviewPage {...props} />);

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Lesson: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "View lesson content and choose resources to download or share",
        ogTitle:
          "Lesson: Islamic Geometry | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "View lesson content and choose resources to download or share",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("includes tier information in SEO", async () => {
      const { seo } = renderWithSeo()(
        <LessonOverviewPage {...propsWithTier} />,
      );

      expect(seo).toEqual(
        expect.objectContaining({
          title:
            "Lesson: Islamic Geometry | Higher | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
          description:
            "View lesson content and choose resources to download or share",
          ogTitle:
            "Lesson: Islamic Geometry | Higher | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
          ogDescription:
            "View lesson content and choose resources to download or share",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
          canonical: "NEXT_PUBLIC_SEO_APP_URL",
          robots: "index,follow",
        }),
      );
    });
    it("includes examboard information in SEO", async () => {
      const { seo } = renderWithSeo()(
        <LessonOverviewPage {...propsWithExamBoard} />,
      );

      expect(seo).toEqual(
        expect.objectContaining({
          title:
            "Lesson: Islamic Geometry | AQA | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
          description:
            "View lesson content and choose resources to download or share",
          ogTitle:
            "Lesson: Islamic Geometry | AQA | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
          ogDescription:
            "View lesson content and choose resources to download or share",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
          canonical: "NEXT_PUBLIC_SEO_APP_URL",
          robots: "index,follow",
        }),
      );
    });
    it("includes tier and examboard information in SEO", async () => {
      const { seo } = renderWithSeo()(
        <LessonOverviewPage {...propsWithTierAndExamBoard} />,
      );

      expect(seo).toEqual(
        expect.objectContaining({
          title:
            "Lesson: Islamic Geometry | Higher | AQA | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
          description:
            "View lesson content and choose resources to download or share",
          ogTitle:
            "Lesson: Islamic Geometry | Higher | AQA | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
          ogDescription:
            "View lesson content and choose resources to download or share",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
          canonical: "NEXT_PUBLIC_SEO_APP_URL",
          robots: "index,follow",
        }),
      );
    });
  });
  describe("tracking events", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });
    it("calls track.downloadResourceButtonClicked will 'all' when download all button is pressed", async () => {
      const { getAllByTestId } = render(<LessonOverviewPage {...props} />);
      const downloadAllButton = getAllByTestId("download-all-button");

      act(() => {
        if (
          downloadAllButton[0] !== undefined &&
          downloadAllButton.length > 0
        ) {
          downloadAllButton[0].click();
        } else {
          throw new Error("downloads all button not found");
        }
      });

      expect(downloadResourceButtonClicked).toHaveBeenCalledWith({
        analyticsUseCase: null,
        downloadResourceButtonName: "all",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        lessonName: "Islamic Geometry",
        lessonSlug: "macbeth-lesson-1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitName: "Maths unit",
        unitSlug: "maths-unit",
      });
    });
    it("calls track.downloadResourceButtonClicked will 'slide deck' when download slide deck button is pressed", async () => {
      const { getByText } = render(<LessonOverviewPage {...props} />);
      const downloadButton = getByText("Download slide deck");

      act(() => {
        downloadButton.click();
      });

      expect(downloadResourceButtonClicked).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        downloadResourceButtonName: "slide deck",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        lessonName: "Islamic Geometry",
        lessonSlug: "macbeth-lesson-1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitName: "Maths unit",
        unitSlug: "maths-unit",
      });
    });
    it("calls track.downloadResourceButtonClicked will 'worksheet' when download worksheet button is pressed", async () => {
      const { getByText } = render(<LessonOverviewPage {...props} />);
      const downloadButton = getByText("Download worksheet");

      act(() => {
        downloadButton.click();
      });

      expect(downloadResourceButtonClicked).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        downloadResourceButtonName: "worksheet",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        lessonName: "Islamic Geometry",
        lessonSlug: "macbeth-lesson-1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitName: "Maths unit",
        unitSlug: "maths-unit",
      });
    });
    it("calls track.downloadResourceButtonClicked will 'exit quiz' when download exit quiz button is pressed", async () => {
      const { getByText } = render(<LessonOverviewPage {...props} />);
      const downloadButton = getByText("Download exit quiz");

      act(() => {
        downloadButton.click();
      });

      expect(downloadResourceButtonClicked).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        downloadResourceButtonName: "exit quiz",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        lessonName: "Islamic Geometry",
        lessonSlug: "macbeth-lesson-1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitName: "Maths unit",
        unitSlug: "maths-unit",
      });
    });
    it("calls track.downloadResourceButtonClicked will 'starter quiz' when download starter quiz button is pressed", async () => {
      const { getByText } = render(<LessonOverviewPage {...props} />);
      const downloadButton = getByText("Download starter quiz");

      act(() => {
        downloadButton.click();
      });

      expect(downloadResourceButtonClicked).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        downloadResourceButtonName: "starter quiz",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        lessonName: "Islamic Geometry",
        lessonSlug: "macbeth-lesson-1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitName: "Maths unit",
        unitSlug: "maths-unit",
      });
    });
    it("calls track.lessonShareStarted when share all button is pressed with legacy", async () => {
      const legacyProps = {
        ...props,
        curriculumData: {
          ...props.curriculumData,
          programmeSlug: "legacy-programme-l",
        },
      };
      const { getAllByTestId } = render(
        <LessonOverviewPage {...legacyProps} />,
      );
      const shareAllButton = getAllByTestId("share-all-button");
      act(() => {
        if (shareAllButton[0] !== undefined && shareAllButton.length > 0) {
          shareAllButton[0].click();
        } else {
          throw new Error("Share all button not found");
        }
      });
      expect(lessonShareStarted).toHaveBeenCalledWith({
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        lessonName: "Islamic Geometry",
        lessonSlug: "macbeth-lesson-1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitName: "Maths unit",
        unitSlug: "maths-unit",
      });
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug:
            "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
          programmeSlug: "english-primary-ks2",
          unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonOverviewPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
      );
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
