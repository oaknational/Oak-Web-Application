import JoinResearchPanelPageHeader from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { joinResearchPanelHeaderBlockFixture as fixture } from "@/__tests__/pages/about-us/get-involved/join-research-panel.fixtures";

const render = renderWithProvidersByName(["oakTheme"]);

describe("JoinResearchPanelHeader", () => {
  test("it renders correct data", () => {
    const { baseElement, getByRole } = render(
      <JoinResearchPanelPageHeader {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(fixture.title);
    expect(
      getByRole("link", {
        name: fixture.button.label + " (opens in new tab)",
      }),
    ).toBeInTheDocument();
  });
});
