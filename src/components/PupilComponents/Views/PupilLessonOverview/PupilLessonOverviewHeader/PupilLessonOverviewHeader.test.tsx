import { PupilLessonOverviewHeader } from "./PupilLessonOverviewHeader";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonOverviewHeader", () => {
  it("renders lesson title and metadata", () => {
    render(
      <PupilLessonOverviewHeader
        lessonTitle="Rivers and coasts"
        yearDescription="Year 7"
        subject="Geography"
        subjectSlug="geography"
        phase="secondary"
      />,
    );

    expect(document.body).toHaveTextContent("Rivers and coasts");
    expect(document.body).toHaveTextContent("Year 7");
    expect(document.body).toHaveTextContent("Geography");
  });
});
