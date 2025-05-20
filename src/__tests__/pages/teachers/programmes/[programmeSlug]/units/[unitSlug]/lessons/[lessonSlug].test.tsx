import { act, screen } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";

import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import LessonOverviewPage, {
  getStaticProps,
  LessonOverviewPageProps,
  URLParams,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";
import { LEGACY_COHORT, NEW_COHORT } from "@/config/cohort";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";

const props = {
  curriculumData: lessonOverviewFixture({
    videoMuxPlaybackId: "pid-001",
    videoWithSignLanguageMuxPlaybackId: "pid-002",
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
      lessonResourceDownloadStarted: (...args: []) =>
        downloadResourceButtonClicked(...args),
      lessonShareStarted: (...args: []) => lessonShareStarted(...args),
    },
  }),
}));

// mock useShareExperiment
jest.mock(
  "@/pages-helpers/teacher/share-experiments/useShareExperiment",
  () => {
    return {
      __esModule: true,
      useShareExperiment: jest.fn(() => ({
        shareExperimentFlag: false,
        shareUrl: "",
        browserUrl: "",
        shareActivated: false,
        shareIdRef: { current: "" },
        shareIdKeyRef: { current: "" },
      })),
    };
  },
);

jest.mock("@/pages-helpers/teacher/share-experiments/useTeacherNotes", () => {
  return {
    __esModule: true,
    useTeacherNotes: jest.fn(() => ({
      teacherNote: {},
      isEditable: false,
      saveTeacherNote: jest.fn(),
      noteSaved: false,
      error: undefined,
    })),
  };
});

const render = renderWithProviders();

describe("pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]", () => {
  beforeEach(() => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockUserWithDownloadAccess,
    });
    console.error = jest.fn();
  });
  it("Renders title from the props", async () => {
    render(<LessonOverviewPage {...props} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Adverbial complex sentences",
    );
  });

  it("renders sign language button if there is a sign language video", async () => {
    render(<LessonOverviewPage {...props} />);

    expect(screen.getByText("Show sign language")).toBeInTheDocument();
  });

  it("renders Download All button if lesson has downloadable resources", async () => {
    render(<LessonOverviewPage curriculumData={lessonOverviewFixture()} />);

    expect(screen.getAllByTestId("download-all-button")[0]).toHaveTextContent(
      "Download all resources",
    );
  });

  it("does not render Download All button if lesson has no downloadable resources", async () => {
    render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
          expired: false,
          downloads: [],
        })}
      />,
    );

    expect(screen.queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("does not render Download All button if lesson is expired", async () => {
    render(
      <LessonOverviewPage
        curriculumData={lessonOverviewFixture({
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
          expired: true,
          lessonCohort: NEW_COHORT,
        })}
      />,
    );

    const shareButton = queryAllByTestId("share-all-button");
    const shareLabel = queryAllByText("Share activities with pupils");

    if (shareButton[0] !== undefined && shareButton.length > 0) {
      expect(shareButton[0]).toBeDisabled();
      expect(shareLabel[0]).toBeInTheDocument();
    } else {
      throw new Error("Share all button not found");
    }
  });

  it("updates the url", async () => {
    window.history.replaceState = jest.fn();

    (useShareExperiment as jest.Mock).mockReturnValueOnce({
      shareUrl: "http://localhost:3000/teachers/lessons/lesson-1?test=1",
      browserUrl: "http://localhost:3000/teachers/lessons/lesson-1?test=1",
      shareActivated: false,
      shareIdRef: { current: "" },
      shareIdKeyRef: { current: "" },
    });
    render(<LessonOverviewPage {...props} />);

    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      "",
      "http://localhost:3000/teachers/lessons/lesson-1?test=1",
    );
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

  it("renders an iframe for a lesson guide and additional material google doc", () => {
    const { getAllByTestId } = render(<LessonOverviewPage {...props} />);
    const iframeElement = getAllByTestId("overview-presentation-document");
    expect(iframeElement.length).toEqual(2);
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(<LessonOverviewPage {...props} />);

      const { lessonSlug, unitSlug, programmeSlug } = props.curriculumData;

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Lesson: Adverbial complex sentences | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "View lesson content and choose resources to download or share",
        ogTitle:
          "Lesson: Adverbial complex sentences | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "View lesson content and choose resources to download or share",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: `NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}`,
        robots: "index,follow",
      });
    });
    it("includes tier information in SEO", async () => {
      const { seo } = renderWithSeo()(
        <LessonOverviewPage {...propsWithTier} />,
      );

      const { lessonSlug, unitSlug, programmeSlug } = props.curriculumData;

      expect(seo).toEqual(
        expect.objectContaining({
          canonical: `NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}`,
          description:
            "View lesson content and choose resources to download or share",
          ogDescription:
            "View lesson content and choose resources to download or share",
          ogImage:
            "NEXT_PUBLIC_SEO_APP_URL/images/sharing/default-social-sharing-2022.png?2025",
          ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
          ogTitle:
            "Lesson: Adverbial complex sentences | Higher | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
          robots: "index,follow",
          title:
            "Lesson: Adverbial complex sentences | Higher | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
        }),
      );
    });
    it("includes examboard information in SEO", async () => {
      const { seo } = renderWithSeo()(
        <LessonOverviewPage {...propsWithExamBoard} />,
      );

      const { lessonSlug, unitSlug, programmeSlug } =
        propsWithExamBoard.curriculumData;

      expect(seo).toEqual(
        expect.objectContaining({
          title:
            "Lesson: Adverbial complex sentences | AQA | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
          description:
            "View lesson content and choose resources to download or share",

          ogTitle:
            "Lesson: Adverbial complex sentences | AQA | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
          ogDescription:
            "View lesson content and choose resources to download or share",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
          canonical: `NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}`,
          robots: "index,follow",
        }),
      );
    });
    it("includes tier and examboard information in SEO", async () => {
      const { seo } = renderWithSeo()(
        <LessonOverviewPage {...propsWithTierAndExamBoard} />,
      );

      const { lessonSlug, unitSlug, programmeSlug } =
        propsWithTierAndExamBoard.curriculumData;

      expect(seo).toEqual(
        expect.objectContaining({
          title:
            "Lesson: Adverbial complex sentences | Higher | AQA | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
          description:
            "View lesson content and choose resources to download or share",
          ogTitle:
            "Lesson: Adverbial complex sentences | Higher | AQA | KS2 English | NEXT_PUBLIC_SEO_APP_NAME",
          ogDescription:
            "View lesson content and choose resources to download or share",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
          ogImage:
            "NEXT_PUBLIC_SEO_APP_URL/images/sharing/default-social-sharing-2022.png?2025",
          ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
          canonical: `NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}`,
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
        analyticsUseCase: "Teacher",
        downloadResourceButtonName: "all",
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        subjectSlug: "english",
        subjectTitle: "English",
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        componentType: "lesson_download_button",
        tierName: null,
        examBoard: null,
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        pathway: null,
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
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        subjectSlug: "english",
        subjectTitle: "English",
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        componentType: "lesson_download_button",
        tierName: null,
        examBoard: null,
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        pathway: null,
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
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        subjectSlug: "english",
        subjectTitle: "English",
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        componentType: "lesson_download_button",
        tierName: null,
        examBoard: null,
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        pathway: null,
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
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        subjectSlug: "english",
        subjectTitle: "English",
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        componentType: "lesson_download_button",
        tierName: null,
        examBoard: null,
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        pathway: null,
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
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        subjectSlug: "english",
        subjectTitle: "English",
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        componentType: "lesson_download_button",
        tierName: null,
        examBoard: null,
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        pathway: null,
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
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        subjectSlug: "english",
        subjectTitle: "English",
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
      });
    });

    it("updates the url if shareExperimentFlag is true", async () => {
      window.history.replaceState = jest.fn();

      (useShareExperiment as jest.Mock).mockReturnValueOnce({
        shareExperimentFlag: true,
        shareUrl: "http://localhost:3000/teachers/lessons/lesson-1?test=1",
        browserUrl: "http://localhost:3000/teachers/lessons/lesson-1?test=1",
        shareActivated: false,
        shareIdRef: { current: "" },
        shareIdKeyRef: { current: "" },
      });
      render(<LessonOverviewPage {...props} />);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        "",
        "http://localhost:3000/teachers/lessons/lesson-1?test=1",
      );
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
