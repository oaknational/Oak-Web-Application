import { PupilLessonIntroReadyCard } from "./PupilLessonIntroReadyCard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonIntroReadyCard", () => {
  it("renders the default copy", () => {
    render(<PupilLessonIntroReadyCard />);

    expect(document.body).toHaveTextContent("Are you ready to learn?");
    expect(document.body).toHaveTextContent(
      "Are you sitting in a quiet space away from distractions?",
    );
    expect(document.body).toHaveTextContent(
      "Do you have all the equipment you need?",
    );
  });

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
