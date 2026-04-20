import { screen, act } from "@testing-library/react";

import LessonView from "./LessonView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const lessonResourceDownloadStarted = jest.fn();
const lessonMediaClipsStarted = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonMediaClipsStarted: (...args: unknown[]) =>
        lessonMediaClipsStarted(...args),
      lessonResourceDownloadStarted: (...args: unknown[]) =>
        lessonResourceDownloadStarted(...args),
    },
  }),
}));

const render = renderWithProviders();

const baseProps = teachersLessonOverviewFixture();

describe("Previous and Next Lesson Navigation", () => {
  it("renders previous and next lesson links when adjacent lessons exist", () => {
    render(
      <LessonView
        {...baseProps}
        previousLesson={{
          lessonSlug: "lesson-2",
          lessonTitle: "Previous lesson",
          lessonIndex: 2,
        }}
        nextLesson={{
          lessonSlug: "lesson-4",
          lessonTitle: "Next lesson",
          lessonIndex: 4,
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Previous lesson/i }),
    ).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-2",
    );
    expect(screen.getByRole("link", { name: /Next lesson/i })).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-4",
    );
  });

  it("does not render lesson nav links when adjacent lessons are missing", () => {
    render(
      <LessonView {...baseProps} previousLesson={null} nextLesson={null} />,
    );

    expect(
      screen.queryByRole("link", { name: /Previous lesson/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Next lesson/i }),
    ).not.toBeInTheDocument();
  });

  it("renders previous and next lesson links when orderInUnit is null", () => {
    render(
      <LessonView
        {...baseProps}
        orderInUnit={null}
        previousLesson={{
          lessonSlug: "lesson-2",
          lessonTitle: "Previous lesson",
          lessonIndex: 2,
        }}
        nextLesson={{
          lessonSlug: "lesson-4",
          lessonTitle: "Next lesson",
          lessonIndex: 4,
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Previous lesson/i }),
    ).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-2",
    );
    expect(screen.getByRole("link", { name: /Next lesson/i })).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-4",
    );
  });
});

describe("Lesson resources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders lesson details section", () => {
    render(<LessonView {...baseProps} />);

    expect(
      screen.getByRole("heading", { name: /Lesson details/i }),
    ).toBeInTheDocument();
  });

  it("renders starter quiz when data is provided", () => {
    render(<LessonView {...baseProps} />);

    expect(
      screen.getByRole("heading", { name: /Prior knowledge starter quiz/i }),
    ).toBeInTheDocument();
  });

  it("renders exit quiz when data is provided", () => {
    render(<LessonView {...baseProps} />);

    expect(
      screen.getByRole("heading", { name: /Assessment exit quiz/i }),
    ).toBeInTheDocument();
  });

  it("renders worksheet section when worksheetUrl is provided", () => {
    render(
      <LessonView
        {...baseProps}
        worksheetUrl="https://example.com/worksheet.pdf"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Worksheet/i }),
    ).toBeInTheDocument();
  });

  it("does not render worksheet section when worksheetUrl is null", () => {
    render(<LessonView {...baseProps} worksheetUrl={null} />);

    expect(
      screen.queryByRole("heading", { name: /^Worksheet$/i }),
    ).not.toBeInTheDocument();
  });

  it("renders lesson slides when presentationUrl is provided", () => {
    render(
      <LessonView
        {...baseProps}
        presentationUrl="https://example.com/slides.pdf"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Lesson slides/i }),
    ).toBeInTheDocument();
  });

  it("renders lesson guide when lessonGuideUrl is provided", () => {
    render(
      <LessonView
        {...baseProps}
        lessonGuideUrl="https://example.com/guide.pdf"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Lesson guide/i }),
    ).toBeInTheDocument();
  });

  it("renders media clips when hasMediaClips is true and lessonMediaClips provided", () => {
    render(
      <LessonView
        {...baseProps}
        hasMediaClips={true}
        lessonMediaClips={lessonMediaClipsFixtures().mediaClips}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Video & audio clips/i }),
    ).toBeInTheDocument();
  });

  it("does not render media clips section when lessonMediaClips is null", () => {
    render(
      <LessonView
        {...baseProps}
        hasMediaClips={false}
        lessonMediaClips={null}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: /Video & audio clips/i }),
    ).not.toBeInTheDocument();
  });

  it("renders additional material when additionalMaterialUrl is provided", () => {
    render(
      <LessonView
        {...baseProps}
        additionalMaterialUrl="https://example.com/additional.pdf"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Additional material/i }),
    ).toBeInTheDocument();
  });

  it("does not render additional material when additionalMaterialUrl is null", () => {
    render(<LessonView {...baseProps} additionalMaterialUrl={null} />);

    expect(
      screen.queryByRole("heading", { name: /Additional material/i }),
    ).not.toBeInTheDocument();
  });

  it("renders download button for downloadable resources", () => {
    render(
      <LessonView
        {...baseProps}
        presentationUrl="https://example.com/slides.pdf"
        downloads={[{ exists: true, type: "presentation" }]}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Download lesson slides/i }),
    ).toBeInTheDocument();
  });
});

describe("Tracking callbacks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls lessonResourceDownloadStarted when download button is clicked for slides", () => {
    render(
      <LessonView
        {...baseProps}
        presentationUrl="https://example.com/slides.pdf"
        downloads={[{ exists: true, type: "presentation" }]}
      />,
    );

    const downloadButton = screen.getByRole("link", {
      name: /Download lesson slides/i,
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
    render(
      <LessonView
        {...baseProps}
        worksheetUrl="https://example.com/worksheet.pdf"
        downloads={[
          { exists: true, type: "worksheet-pdf" },
          { exists: true, type: "worksheet-pptx" },
        ]}
      />,
    );

    const downloadButton = screen.getByRole("link", {
      name: /Download worksheet/i,
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
    render(<LessonView {...baseProps} />);

    const downloadButtons = screen.getAllByRole("link", {
      name: /Download quiz pdf/i,
    });
    act(() => {
      downloadButtons[0]?.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        downloadResourceButtonName: "starter quiz",
      }),
    );
  });

  it("calls lessonResourceDownloadStarted when exit quiz download is clicked", () => {
    render(<LessonView {...baseProps} />);

    const downloadButtons = screen.getAllByRole("link", {
      name: /Download quiz pdf/i,
    });
    act(() => {
      downloadButtons[1]?.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        downloadResourceButtonName: "exit quiz",
      }),
    );
  });

  it("includes browse pathway data in tracking calls", () => {
    render(
      <LessonView
        {...baseProps}
        presentationUrl="https://example.com/slides.pdf"
        downloads={[{ exists: true, type: "presentation" }]}
      />,
    );

    const downloadButton = screen.getByRole("link", {
      name: /Download lesson slides/i,
    });
    act(() => {
      downloadButton.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
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

  it("calls lessonMediaClipsStarted when play all button is clicked", () => {
    render(
      <LessonView
        {...baseProps}
        hasMediaClips={true}
        lessonMediaClips={lessonMediaClipsFixtures().mediaClips}
      />,
    );

    const playAllButton = screen.getByText("Play all");
    act(() => {
      playAllButton.click();
    });

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
});
