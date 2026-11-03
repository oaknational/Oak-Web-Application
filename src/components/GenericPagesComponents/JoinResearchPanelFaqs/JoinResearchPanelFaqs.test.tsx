import { basic as fixture } from "./JoinResearchPanelFaqs.fixtures";

import JoinResearchPanelFaqs from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("JoinResearchPanelFaqs", () => {
  test("it renders correct data", () => {
    const { baseElement, getByRole } = render(
      <JoinResearchPanelFaqs {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      "Frequently asked questions",
    );
  });
});
