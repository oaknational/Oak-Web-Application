import userEvent from "@testing-library/user-event";

import {
  PupilLessonReviewBottomNav,
  PupilLessonReviewFeedbackCard,
  PupilLessonReviewSections,
  PupilLessonReviewShareOptions,
  PupilLessonReviewView,
} from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonReview", () => {
  it("renders the review view slots", () => {
    render(
      <PupilLessonReviewView
        phase="secondary"
        lessonTitle="Fractions recap"
        overviewButtonSlot={<a href="/overview">Lesson overview</a>}
        shareOptionsSlot={<div>Share options slot</div>}
        illustrationSlot={<div>Illustration</div>}
        sectionSummarySlot={<div>Section summary</div>}
        feedbackSlot={<div>Feedback</div>}
        bottomNavSlot={<div>Bottom nav</div>}
      />,
    );

    expect(document.body).toHaveTextContent("Lesson review");
    expect(document.body).toHaveTextContent("Fractions recap");
    expect(document.body).toHaveTextContent("Lesson overview");
    expect(document.body).toHaveTextContent("Share options slot");
    expect(document.body).toHaveTextContent("Section summary");
    expect(document.body).toHaveTextContent("Feedback");
    expect(document.body).toHaveTextContent("Bottom nav");
  });

  it("renders the bottom nav only when a href is provided", () => {
    const { container: emptyContainer } = render(
      <PupilLessonReviewBottomNav />,
    );
    const { container: filledContainer } = render(
      <PupilLessonReviewBottomNav href="/lessons" />,
    );

    expect(emptyContainer).toBeEmptyDOMElement();
    expect(filledContainer).toHaveTextContent("View all lessons");
    expect(filledContainer.querySelector("a")).toHaveAttribute(
      "href",
      "/lessons",
    );
  });

  it("renders the feedback card content", () => {
    render(<PupilLessonReviewFeedbackCard feedback="Great effort!" />);

    expect(document.body).toHaveTextContent("Great effort!");
  });

  it("renders summary cards for intro, video and quiz sections", () => {
    render(
      <PupilLessonReviewSections
        items={[
          { section: "intro", completed: true },
          { section: "video", completed: false },
          {
            section: "starter-quiz",
            completed: true,
            grade: 3,
            numQuestions: 4,
            resultsSlot: <div>Starter quiz results</div>,
          },
        ]}
      />,
    );

    expect(document.body).toHaveTextContent("Introduction");
    expect(document.body).toHaveTextContent("Lesson video");
    expect(document.body).toHaveTextContent("Starter quiz");
    expect(document.body).toHaveTextContent("Starter quiz results");
  });

  it("renders share actions and the shared state feedback", async () => {
    const onCopyLink = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonReviewShareOptions
        showPrintable={true}
        printableHref="/printable"
        onCopyLink={onCopyLink}
        shareState="shared"
      />,
    );

    await user.click(
      document.querySelector(
        '[data-testid="share-results-button"]',
      ) as HTMLElement,
    );

    expect(
      document.querySelector('[data-testid="printable-results-button"]'),
    ).toHaveAttribute("href", "/printable");
    expect(onCopyLink).toHaveBeenCalledTimes(1);
    expect(document.body).toHaveTextContent(
      "Link copied to clipboard! You can share this with your teacher.",
    );
  });
});
