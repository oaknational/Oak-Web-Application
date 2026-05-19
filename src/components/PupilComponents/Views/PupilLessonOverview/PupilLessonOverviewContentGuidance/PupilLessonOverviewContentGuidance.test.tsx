import { PupilLessonOverviewContentGuidance } from "./PupilLessonOverviewContentGuidance";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonOverviewContentGuidance", () => {
  it("renders formatted content guidance", () => {
    render(
      <PupilLessonOverviewContentGuidance
        heading="Guidance"
        contentGuidance={[
          {
            contentguidanceLabel: "Scenes of conflict",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ]}
        supervisionLevel="Adult supervision recommended"
      />,
    );

    expect(document.body).toHaveTextContent("Guidance");
    expect(document.body).toHaveTextContent(
      "Scenes of conflict. Adult supervision recommended.",
    );
  });

  it("does not render without content guidance", () => {
    const { container } = render(
      <PupilLessonOverviewContentGuidance contentGuidance={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
