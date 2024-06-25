import { act, screen } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";

import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import specialistLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonOverview.fixture";
import SpecialistLessonOverviewPage, {
  getStaticProps,
  SpecialistLessonOverviewPageProps,
  URLParams,
} from "@/pages/teachers/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";

const props = {
  curriculumData: specialistLessonOverviewFixture(),
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

describe("pages/teachers/specialist/programmes/units/[unitSlug]/lessons/[lessonSlug]", () => {
  it("Renders title from the props", async () => {
    render(<SpecialistLessonOverviewPage {...props} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Composition: Following a Recipe",
    );
  });

  it("renders Download All button if lesson has downloadable resources", async () => {
    render(
      <SpecialistLessonOverviewPage
        curriculumData={specialistLessonOverviewFixture({})}
      />,
    );

    expect(screen.getAllByTestId("download-all-button")[0]).toHaveTextContent(
      "Download all resources",
    );
  });

  it("does not render Download All button if lesson has no downloadable resources", async () => {
    render(
      <SpecialistLessonOverviewPage
        curriculumData={specialistLessonOverviewFixture({
          expired: false,
          downloads: [],
        })}
      />,
    );

    expect(screen.queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("does not render Download All button if lesson is expired", async () => {
    render(
      <SpecialistLessonOverviewPage
        curriculumData={specialistLessonOverviewFixture({
          expired: true,
        })}
      />,
    );

    expect(screen.queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("renders an iframe for a presentation and worksheet", async () => {
    const { getAllByTestId } = render(
      <SpecialistLessonOverviewPage {...props} />,
    );
    const iframeElement = getAllByTestId("overview-presentation");
    expect(iframeElement.length).toEqual(2);
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <SpecialistLessonOverviewPage {...props} />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Lesson: Composition: Following a Recipe | APPLYING LEARNING Communication and language | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Overview of lesson",
        ogTitle:
          "Lesson: Composition: Following a Recipe | APPLYING LEARNING Communication and language | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Overview of lesson",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });

  // TRACKING EVENTS NOT IMPLEMENTED FOR SPECIALIST LESSON OVERVIEW PAGE
  describe.skip("tracking events", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });
    it("calls track.downloadResourceButtonClicked will 'all' when download all button is pressed", async () => {
      const { getAllByTestId } = render(
        <SpecialistLessonOverviewPage {...props} />,
      );
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
      const { getByText } = render(<SpecialistLessonOverviewPage {...props} />);
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
      const { getByText } = render(<SpecialistLessonOverviewPage {...props} />);
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
      const { getByText } = render(<SpecialistLessonOverviewPage {...props} />);
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
      const { getByText } = render(<SpecialistLessonOverviewPage {...props} />);
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
        <SpecialistLessonOverviewPage {...legacyProps} />,
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
    // Figure out why this is broken
    it.skip("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "composition-following-a-recipe-ccrk2r",
          programmeSlug: "communication-and-language-applying-learning",
          unitSlug: "celebrations-and-festivals-primary-1f8f",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: SpecialistLessonOverviewPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "composition-following-a-recipe-ccrk2r",
      );
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
