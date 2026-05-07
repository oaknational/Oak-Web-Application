import { PupilLessonIntroReadyCard } from "./PupilLessonIntroReadyCard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonIntroReadyCard", () => {
  it("renders the configured copy", () => {
    render(
      <PupilLessonIntroReadyCard
        heading="Ready?"
        lineOne="Find a quiet space."
        lineTwo="Have your notebook ready."
      />,
    );

    expect(document.body).toHaveTextContent("Ready?");
    expect(document.body).toHaveTextContent("Find a quiet space.");
    expect(document.body).toHaveTextContent("Have your notebook ready.");
  });
});
