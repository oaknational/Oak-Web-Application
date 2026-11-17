import { basic as fixture } from "./JoinResearchPanelHeader.fixtures";

import JoinResearchPanelPageHeader from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

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
