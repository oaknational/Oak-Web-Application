import { basic as fixture } from "./fixtures";

import JoinResearchPanelJourney from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import useAnalytics from "@/context/Analytics/useAnalytics";

const render = renderWithProvidersByName(["oakTheme"]);

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("JoinResearchPanelJourney", () => {
  test("it renders correct data", () => {
    const aboutUsContactInitiated = jest.fn();
    (useAnalytics as jest.Mock).mockReturnValue({
      track: { aboutUsContactInitiated },
    });

    const { baseElement, getByRole, getAllByRole } = render(
      <JoinResearchPanelJourney {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(fixture.title);
    const stepHeadings = getAllByRole("heading", { level: 3 });
    expect(stepHeadings).toHaveLength(fixture.steps.length);
    expect(stepHeadings[0]).toHaveTextContent(fixture.steps[0]!.title);
    expect(stepHeadings[1]).toHaveTextContent(fixture.steps[1]!.title);
    expect(stepHeadings[2]).toHaveTextContent(fixture.steps[2]!.title);

    const linkElement = getByRole("link", { name: "sign-up form" });
    expect(linkElement).toHaveAttribute("href", "https://example.com");
  });
});
