import { PupilLessonReviewFeedbackCard } from "./PupilLessonReviewFeedbackCard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonReviewFeedbackCard", () => {
  it("renders feedback content", () => {
    render(<PupilLessonReviewFeedbackCard feedback="Great effort!" />);

    expect(document.body).toHaveTextContent("Great effort!");
  });
});
