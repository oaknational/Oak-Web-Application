import { basic as fixture } from "./JoinResearchPanelFaqs.fixtures";

import JoinResearchPanelFaqs from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName([
  "oakTheme",
  "teacherBrowseAnalytics",
  "analytics",
  "cookieConsent",
]);

describe("JoinResearchPanelFaqs", () => {
  test("it renders correct data", () => {
    const { container } = render(<JoinResearchPanelFaqs {...fixture} />);

    expect(container).toMatchSnapshot();
  });
});
