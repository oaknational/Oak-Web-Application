import { basic as fixture } from "./JoinResearchPanelCallout.fixtures";

import JoinResearchPanelCallout from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

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
