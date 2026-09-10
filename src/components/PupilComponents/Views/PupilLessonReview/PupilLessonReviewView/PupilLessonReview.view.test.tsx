import { PupilLessonReviewView } from "./PupilLessonReview.view";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonReviewView", () => {
  it("renders the supplied slots", () => {
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
});
