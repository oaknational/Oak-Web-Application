import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFeatureFlagEnabled } from "posthog-js/react";

import LessonView from "./LessonView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

const lessonResourceDownloadStarted = jest.fn();
const lessonMediaClipsStarted = jest.fn();
const lessonShareStarted = jest.fn();
const mockCreateTeachingMaterialsInitiated = jest.fn();
const mockTeachingMaterialsSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    getSessionId: jest.fn(),
    track: {
      lessonMediaClipsStarted: (...args: unknown[]) =>
        lessonMediaClipsStarted(...args),
      lessonResourceDownloadStarted: (...args: unknown[]) =>
        lessonResourceDownloadStarted(...args),
      lessonShareStarted: (...args: unknown[]) => lessonShareStarted(...args),
      createTeachingMaterialsInitiated: (...args: unknown[]) =>
        mockCreateTeachingMaterialsInitiated(...args),
      teachingMaterialsSelected: (...args: unknown[]) =>
        mockTeachingMaterialsSelected(...args),
    },
  }),
}));

jest.mock(
  "@/components/TeacherComponents/LessonOverviewMediaClips/LessonOverviewMediaClips.tsx",
);

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(),
}));

const mockUseFeatureFlagEnabled = useFeatureFlagEnabled as jest.MockedFunction<
  typeof useFeatureFlagEnabled
>;

const render = renderWithProviders();

const baseProps = teachersLessonOverviewFixture();
const programmeState = getProgrammeStateForLesson(baseProps);

const renderLessonView = (props?: Partial<TeachersLessonOverviewPageData>) => {
  return render(
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={{
        programmeState,
      }}
    >
      <LessonView {...baseProps} {...props} />
    </TeacherBrowseAnalyticsStoreProvider>,
  );
};

describe("Previous and Next Lesson Navigation", () => {
  it("renders previous and next lesson links when adjacent lessons exist", () => {
    renderLessonView({
      previousLesson: {
        lessonSlug: "lesson-2",
        lessonTitle: "Previous lesson",
        lessonIndex: 2,
      },
      nextLesson: {
        lessonSlug: "lesson-4",
        lessonTitle: "Next lesson",
        lessonIndex: 4,
      },
    });

    expect(
      screen.getByRole("link", { name: /Previous lesson/i }),
    ).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        programmeSlug: baseProps.programmeSlug,
        unitSlug: baseProps.unitSlug,
        lessonSlug: "lesson-2",
      }),
    );
    expect(screen.getByRole("link", { name: /Next lesson/i })).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        programmeSlug: baseProps.programmeSlug,
        unitSlug: baseProps.unitSlug,
        lessonSlug: "lesson-4",
      }),
    );
  });

  it("does not render lesson nav links when adjacent lessons are missing", () => {
    renderLessonView({ previousLesson: null, nextLesson: null });

    expect(
      screen.queryByRole("link", { name: /Previous lesson/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Next lesson/i }),
    ).not.toBeInTheDocument();
  });

  it("renders previous and next lesson links when orderInUnit is null", () => {
    renderLessonView({
      orderInUnit: null,
      previousLesson: {
        lessonSlug: "lesson-2",
        lessonTitle: "Previous lesson",
        lessonIndex: 2,
      },
      nextLesson: {
        lessonSlug: "lesson-4",
        lessonTitle: "Next lesson",
        lessonIndex: 4,
      },
    });

    expect(
      screen.getByRole("link", { name: /Previous lesson/i }),
    ).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        programmeSlug: baseProps.programmeSlug,
        unitSlug: baseProps.unitSlug,
        lessonSlug: "lesson-2",
      }),
    );
    expect(screen.getByRole("link", { name: /Next lesson/i })).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        programmeSlug: baseProps.programmeSlug,
        unitSlug: baseProps.unitSlug,
        lessonSlug: "lesson-4",
      }),
    );
  });
});

describe("Heatwave banner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFeatureFlagEnabled.mockReturnValue(true);
  });

  it("shows the heatwave banner when the feature flag is enabled and share is available", () => {
    renderLessonView();

    expect(
      screen.getByText(
        /Disruption this week due to hot weather\? Set this lesson as remote work/i,
      ),
    ).toBeInTheDocument();
  });

  it("does not show the heatwave banner when the feature flag is disabled", () => {
    mockUseFeatureFlagEnabled.mockReturnValue(false);
    renderLessonView();

    expect(
      screen.queryByText(
        /Disruption this week due to hot weather\? Set this lesson as remote work/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("does not show the heatwave banner when the share button is disabled (e.g. Practical PE)", () => {
    renderLessonView({ actions: { disablePupilShare: true } });

    expect(
      screen.queryByText(
        /Disruption this week due to hot weather\? Set this lesson as remote work/i,
      ),
    ).not.toBeInTheDocument();
  });

  afterEach(() => {
    setUseUserReturn(mockLoggedOut);
  });

  it("does not show share for geo restricted lessons even when user is signed in", () => {
    setUseUserReturn(mockLoggedIn);
    renderLessonView({ geoRestricted: true });

    expect(
      screen.queryByRole("link", { name: "Share lesson with pupils" }),
    ).not.toBeInTheDocument();
  });

  it("does not show share for login required lessons even when user is signed in", () => {
    setUseUserReturn(mockLoggedIn);
    renderLessonView({ loginRequired: true });

    expect(
      screen.queryByRole("link", { name: "Share lesson with pupils" }),
    ).not.toBeInTheDocument();
  });

  it("hides the heatwave banner when the dismiss button is clicked", async () => {
    const user = userEvent.setup();
    renderLessonView();
    expect(
      screen.getByText(
        /Disruption this week due to hot weather\? Set this lesson as remote work/i,
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /dismiss/i }));

    expect(
      screen.queryByText(
        /Disruption this week due to hot weather\? Set this lesson as remote work/i,
      ),
    ).not.toBeInTheDocument();
  });
});

describe("Lesson resources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders lesson details section", () => {
    renderLessonView();
    expect(
      screen.getByRole("heading", { name: /Lesson details/i }),
    ).toBeInTheDocument();
  });

  it("renders starter quiz when data is provided", () => {
    renderLessonView();
    expect(
      screen.getByRole("heading", { name: /Prior knowledge starter quiz/i }),
    ).toBeInTheDocument();
  });

  it("renders exit quiz when data is provided", () => {
    renderLessonView();
    expect(
      screen.getByRole("heading", { name: /Assessment exit quiz/i }),
    ).toBeInTheDocument();
  });

  it("renders worksheet section when worksheetUrl is provided", () => {
    renderLessonView({ worksheetUrl: "https://example.com/worksheet.pdf" });

    expect(
      screen.getByRole("heading", { name: /Worksheet/i }),
    ).toBeInTheDocument();
  });

  it("does not render worksheet section when worksheetUrl is null", () => {
    renderLessonView({ worksheetUrl: null });

    expect(
      screen.queryByRole("heading", { name: /^Worksheet$/i }),
    ).not.toBeInTheDocument();
  });

  it("renders lesson slides when presentationUrl is provided", () => {
    renderLessonView({ presentationUrl: "https://example.com/slides.pdf" });

    expect(
      screen.getByRole("heading", { name: /Lesson slides/i }),
    ).toBeInTheDocument();
  });

  it("renders lesson guide when lessonGuideUrl is provided", () => {
    renderLessonView({ lessonGuideUrl: "https://example.com/guide.pdf" });

    expect(
      screen.getByRole("heading", { name: /Lesson guide/i }),
    ).toBeInTheDocument();
  });

  it("renders media clips when hasMediaClips is true and lessonMediaClips provided", () => {
    renderLessonView({
      hasMediaClips: true,
      lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
    });

    expect(
      screen.getByRole("heading", { name: /Video & audio clips/i }),
    ).toBeInTheDocument();
  });

  it("does not render media clips section when lessonMediaClips is null", () => {
    renderLessonView({
      hasMediaClips: false,
      lessonMediaClips: null,
    });

    expect(
      screen.queryByRole("heading", { name: /Video & audio clips/i }),
    ).not.toBeInTheDocument();
  });

  it("renders additional material when additionalMaterialUrl is provided", () => {
    renderLessonView({
      additionalMaterialUrl: "https://example.com/additional.pdf",
    });

    expect(
      screen.getByRole("heading", { name: /Additional material/i }),
    ).toBeInTheDocument();
  });

  it("does not render additional material when additionalMaterialUrl is null", () => {
    renderLessonView({ additionalMaterialUrl: null });

    expect(
      screen.queryByRole("heading", { name: /Additional material/i }),
    ).not.toBeInTheDocument();
  });

  it("renders download button for downloadable resources", () => {
    renderLessonView({
      presentationUrl: "https://example.com/slides.pdf",
      downloads: [{ exists: true, type: "presentation" }],
    });

    expect(
      screen.getByRole("link", { name: /Download lesson slides \(PPTX\)/i }),
    ).toBeInTheDocument();
  });

  it("does not render create with ai button when the lesson has complex copyright", () => {
    renderLessonView({ geoRestricted: true, loginRequired: true });

    const createWithAiButton = screen.queryByRole("button", {
      name: "Create more with AI",
    });
    expect(createWithAiButton).not.toBeInTheDocument();
  });

  it("does not render create with ai button when excludedFromTeachingMaterials is true", () => {
    renderLessonView({ excludedFromTeachingMaterials: true });

    expect(
      screen.queryByRole("button", { name: "Create more with AI" }),
    ).not.toBeInTheDocument();
  });

  it("does not create with ai button when the lesson has no complex copyright", () => {
    renderLessonView();
    const createWithAiButton = screen.getByRole("button", {
      name: "Create more with AI",
    });
    expect(createWithAiButton).toBeInTheDocument();
  });
});

describe("Tracking callbacks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls lessonResourceDownloadStarted when download button is clicked for slides", () => {
    renderLessonView({
      presentationUrl: "https://example.com/slides.pdf",
      downloads: [{ exists: true, type: "presentation" }],
    });

    const downloadButton = screen.getByRole("link", {
      name: /Download lesson slides \(PPTX\)/i,
    });
    act(() => {
      downloadButton.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        componentType: "lesson_download_button",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        downloadResourceButtonName: "slide deck",
      }),
    );
  });

  it("calls lessonResourceDownloadStarted when download button is clicked for worksheet", () => {
    renderLessonView({
      worksheetUrl: "https://example.com/worksheet.pdf",
      downloads: [
        { exists: true, type: "worksheet-pdf" },
        { exists: true, type: "worksheet-pptx" },
      ],
    });

    const downloadButton = screen.getByRole("link", {
      name: /Download worksheet \(PPTX\/PDF\)/i,
    });
    act(() => {
      downloadButton.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        downloadResourceButtonName: "worksheet",
      }),
    );
  });

  it("calls lessonResourceDownloadStarted when starter quiz download is clicked", () => {
    renderLessonView();
    const downloadButton = screen.getByRole("link", {
      name: /Download starter quiz questions \(PDF\)/i,
    });
    act(() => {
      downloadButton.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        downloadResourceButtonName: "starter quiz",
      }),
    );
  });

  it("calls lessonResourceDownloadStarted when exit quiz download is clicked", () => {
    renderLessonView();
    const downloadButton = screen.getByRole("link", {
      name: /Download exit quiz questions \(PDF\)/i,
    });
    act(() => {
      downloadButton.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        downloadResourceButtonName: "exit quiz",
      }),
    );
  });

  it("includes browse pathway data in tracking calls", () => {
    renderLessonView({
      presentationUrl: "https://example.com/slides.pdf",
      downloads: [{ exists: true, type: "presentation" }],
    });

    const downloadButton = screen.getByRole("link", {
      name: /Download lesson slides \(PPTX\)/i,
    });
    act(() => {
      downloadButton.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        keyStageSlug: baseProps.keyStageSlug,
        keyStageTitle: "Key stage 3", // transformed to sentence case
        subjectSlug: baseProps.subjectSlug,
        subjectTitle: baseProps.subjectTitle,
        unitSlug: baseProps.unitSlug,
        unitName: baseProps.unitTitle,
        lessonSlug: baseProps.lessonSlug,
        lessonName: baseProps.lessonTitle,
      }),
    );
  });

  it("calls lessonMediaClipsStarted when play all button is clicked", async () => {
    renderLessonView({
      hasMediaClips: true,
      lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
    });

    const playAllButton = screen.getByText("Play all");
    const user = userEvent.setup();
    playAllButton.addEventListener("click", (e) => e.preventDefault());
    await user.click(playAllButton);

    expect(lessonMediaClipsStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "owa",
        product: "media clips",
        engagementIntent: "use",
        componentType: "go_to_media_clips_page_button",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        mediaClipsButtonName: "play all",
      }),
    );
  });

  it("calls lessonShareStarted when share lesson with pupils is clicked", () => {
    renderLessonView();
    const shareButton = screen.getByRole("link", {
      name: "Share lesson with pupils",
    });
    act(() => {
      shareButton.click();
    });

    expect(lessonShareStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        keyStageSlug: baseProps.keyStageSlug,
        keyStageTitle: baseProps.keyStageTitle,
        subjectSlug: baseProps.subjectSlug,
        subjectTitle: baseProps.subjectTitle,
        unitSlug: baseProps.unitSlug,
        unitName: baseProps.unitTitle,
        lessonSlug: baseProps.lessonSlug,
        lessonName: baseProps.lessonTitle,
      }),
    );
  });

  it("calls createTeachingMaterialsInitiated and teachingMaterialsSelected when clicked in create with ai dropdown", async () => {
    setUseUserReturn(mockLoggedIn);
    renderLessonView();
    const createWithAiButton = screen.getByRole("button", {
      name: "Create more with AI",
    });

    const user = userEvent.setup();
    await user.click(createWithAiButton);
    expect(mockCreateTeachingMaterialsInitiated).toHaveBeenCalled();

    const glossaryLink = screen.getByRole("menuitem", { name: "Glossary" });
    await user.click(glossaryLink);
    expect(mockTeachingMaterialsSelected).toHaveBeenCalled();
  });
});
