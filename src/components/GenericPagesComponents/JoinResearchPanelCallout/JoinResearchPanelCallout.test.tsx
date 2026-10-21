import JoinResearchPanelCallout from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { joinResearchPanelCalloutBlockFixture as fixture } from "@/__tests__/pages/about-us/get-involved/join-research-panel.fixtures";

const render = renderWithProvidersByName(["oakTheme"]);

describe("JoinResearchPanelCallout", () => {
  test("it renders correct data", () => {
    const { baseElement, getByRole } = render(
      <JoinResearchPanelCallout {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(fixture.title);
  });
});
