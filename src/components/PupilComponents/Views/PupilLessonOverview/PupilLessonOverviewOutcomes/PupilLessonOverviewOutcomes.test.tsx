import { PupilLessonOverviewOutcomes } from "./PupilLessonOverviewOutcomes";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonOverviewOutcomes", () => {
  it("renders the heading and outcomes", () => {
    render(
      <PupilLessonOverviewOutcomes
        heading="Outcomes"
        outcomes={["I can explain erosion", "I can compare coastlines"]}
      />,
    );

    expect(document.body).toHaveTextContent("Outcomes");
    expect(document.body).toHaveTextContent("I can explain erosion");
    expect(document.body).toHaveTextContent("I can compare coastlines");
  });

  it("does not render without outcomes", () => {
    const { container } = render(<PupilLessonOverviewOutcomes outcomes={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
