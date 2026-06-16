import { PupilLessonReviewSections } from "./PupilLessonReviewSections";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonReviewSections", () => {
  it("renders intro, video and quiz section summaries", () => {
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

  it("gives the results button an accessible name including the section", async () => {
    const { findByRole } = render(
      <PupilLessonReviewSections
        items={[
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

    // The visible label is "Results" but screen readers should hear which section.
    expect(
      await findByRole("button", { name: "Starter quiz results" }),
    ).toBeInTheDocument();
  });
});
