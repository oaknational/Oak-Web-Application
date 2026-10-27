import JoinResearchPanelInfo from ".";

import { joinResearchPanelInfoBlockFixture } from "@/__tests__/pages/about-us/get-involved/join-research-panel.fixtures";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("JoinResearchPanelInfo", () => {
  test("it renders correct data", () => {
    const fixture = joinResearchPanelInfoBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
    );

    const { baseElement, getByRole } = render(
      <JoinResearchPanelInfo {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(fixture.title);
  });
});
