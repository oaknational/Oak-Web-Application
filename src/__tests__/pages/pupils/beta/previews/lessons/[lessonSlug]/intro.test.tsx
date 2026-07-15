import "@testing-library/jest-dom";
import { act, fireEvent } from "@testing-library/react";

import PupilLessonIntroPage, {
  getStaticProps,
} from "@/pages/pupils/beta/previews/lessons/[lessonSlug]/intro";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

const useWorksheetInfoState = jest.fn(
  (_hasWorksheetAssetObject: boolean | null, _lessonSlug: string) => ({
    worksheetInfo: null,
  }),
);
jest.mock(
  "@/components/PupilComponents/pupilUtils/useWorksheetInfoState",
  () => ({
    useWorksheetInfoState: (...args: [boolean | null, string]) =>
      useWorksheetInfoState(...args),
  }),
);

const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath: "/intro", push: routerPush }),
}));

const track = {
  trackSectionStarted: jest.fn(),
  trackLessonStarted: jest.fn(),
  trackLessonCompleted: jest.fn(),
  trackIntroCompleted: jest.fn(),
  trackIntroAbandoned: jest.fn(),
  trackWorksheetDownloaded: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => track,
}));

const startWorksheet = jest.fn(() => Promise.resolve(true));
jest.mock(
  "@/components/PupilComponents/Views/ViewHelpers/Intro/useWorksheetDownload",
  () => ({
    useWorksheetDownload: () => ({
      startDownload: startWorksheet,
      isDownloading: false,
    }),
  }),
);

const startFiles = jest.fn();
jest.mock(
  "@/components/PupilComponents/Views/ViewHelpers/Intro/useAdditionalFilesDownload",
  () => ({
    useAdditionalFilesDownload: () => ({
      startAdditionalFilesDownload: startFiles,
      isAdditionalFilesDownloading: false,
    }),
  }),
);

const getPropsMock = jest.fn();
const buildPageProps = jest.fn();
jest.mock("@/pages-helpers/pupil/lessons-pages/getProps", () => ({
  getProps: (...args: unknown[]) => getPropsMock(...args),
}));
jest.mock("@/node-lib/getPageProps", () => ({
  __esModule: true,
  default: (args: unknown) => buildPageProps(args),
}));

jest.mock("@/components/PupilComponents/PupilLayout/PupilLayout", () => ({
  PupilLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const render = renderWithProvidersByName(["oakTheme"]);

const renderPage = (
  props: Partial<React.ComponentProps<typeof PupilLessonIntroPage>> = {},
) =>
  render(
    <PupilLessonIntroPage
      browseData={lessonBrowseDataFixture({})}
      lessonContent={lessonContentFixture({})}
      backUrl={null}
      hasWorksheet={false}
      worksheetInfo={null}
      hasAdditionalFiles={false}
      additionalFiles={null}
      variant={null}
      initialSection="intro"
      pageType="preview"
      {...props}
    />,
  );

beforeEach(() => {
  jest.clearAllMocks();
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
  });
});

describe("pages/pupils/beta/previews/lessons/[lessonSlug]/intro", () => {
  it("renders worksheet metadata from client worksheetInfo when props worksheetInfo is null", () => {
    useWorksheetInfoState.mockReturnValueOnce({
      worksheetInfo: [{ ext: "pdf", fileSize: "1MB" }] as never,
    });

    const { getByText } = renderPage({
      hasWorksheet: true,
      worksheetInfo: null,
    });

    expect(getByText(/Download worksheet/i)).toBeInTheDocument();
    expect(getByText(/\(PDF 1MB\)/)).toBeInTheDocument();
    expect(useWorksheetInfoState).toHaveBeenCalled();
  });

  it("completes the section and navigates on proceed", async () => {
    const { getByTestId } = renderPage();
    await act(async () => {
      fireEvent.click(getByTestId("proceed-to-next-section"));
    });
    expect(track.trackIntroCompleted).toHaveBeenCalledTimes(1);
    expect(
      usePupilLessonProgress.getState().sectionResults.intro?.isComplete,
    ).toBe(true);
    expect(routerPush).toHaveBeenCalledTimes(1);
  });

  it("tracks intro abandoned when the back link is clicked", () => {
    const { getByLabelText } = renderPage();
    fireEvent.click(getByLabelText("Back"));
    expect(track.trackIntroAbandoned).toHaveBeenCalledTimes(1);
  });

  it("triggers worksheet and additional file downloads", async () => {
    const { getByText } = renderPage({
      hasWorksheet: true,
      worksheetInfo: [{ ext: "pdf", fileSize: "1MB" }] as never,
      hasAdditionalFiles: true,
      additionalFiles: [
        {
          assetId: "a",
          mediaObject: { displayName: "f", bytes: 1, url: "/a" },
        },
      ] as never,
    });
    fireEvent.click(getByText(/Download worksheet/));
    fireEvent.click(getByText("Download file"));
    expect(startWorksheet).toHaveBeenCalledTimes(1);
    expect(startFiles).toHaveBeenCalledTimes(1);
    await Promise.resolve();
    expect(track.trackWorksheetDownloaded).toHaveBeenCalledTimes(1);
  });

  it("does not track worksheet download when the download fails", async () => {
    startWorksheet.mockResolvedValueOnce(false);
    const { getByText } = renderPage({
      hasWorksheet: true,
      worksheetInfo: [{ ext: "pdf", fileSize: "1MB" }] as never,
    });
    fireEvent.click(getByText(/Download worksheet/));
    await Promise.resolve();
    expect(startWorksheet).toHaveBeenCalledTimes(1);
    expect(track.trackWorksheetDownloaded).not.toHaveBeenCalled();
  });

  describe("getStaticProps", () => {
    it("binds the intro section and delegates to getProps as preview", async () => {
      buildPageProps.mockResolvedValue({ props: {} });
      await getStaticProps({
        params: { lessonSlug: "lesson-1" },
      } as never);
      expect(getPropsMock).toHaveBeenCalledWith({
        page: "preview",
        context: expect.objectContaining({
          params: expect.objectContaining({
            lessonSlug: "lesson-1",
            section: "intro",
          }),
        }),
      });
      expect(buildPageProps).toHaveBeenCalledWith(
        expect.objectContaining({
          page: "pupils-lesson-preview-intro::getStaticProps",
        }),
      );
    });

    it("falls back to undefined params when context.params is missing", async () => {
      buildPageProps.mockResolvedValue({ props: {} });
      await getStaticProps({} as never);
      expect(getPropsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({ params: undefined }),
        }),
      );
    });
  });
});
