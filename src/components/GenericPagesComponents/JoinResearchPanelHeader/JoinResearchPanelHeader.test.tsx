import { render } from "@testing-library/react";

import joinResearchPanelHeaderFixture from "./JoinResearchPanelHeader.fixtures";

import JoinResearchPanelPageHeader from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("JoinResearchPanelHeader", () => {
  test("it renders correct data", () => {
    const { baseElement, getByRole } = render(
      <JoinResearchPanelPageHeader {...joinResearchPanelHeaderFixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      joinResearchPanelHeaderFixture.title,
    );
    expect(
      getByRole("link", {
        name:
          joinResearchPanelHeaderFixture.button.label + " (opens in new tab)",
      }),
    ).toBeInTheDocument();
  });
});
