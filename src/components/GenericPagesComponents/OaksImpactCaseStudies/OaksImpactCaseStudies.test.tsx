import { oaksImpactCaseStudiesFixture } from "./OaksImpactCaseStudies.fixtures";

import { OaksImpactCaseStudies } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactCaseStudies", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <OaksImpactCaseStudies caseStudies={oaksImpactCaseStudiesFixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();
    expect(
      getAllByRole("link", { name: /case study [1-3] watch the video/i }),
    ).toHaveLength(3);
  });
});
