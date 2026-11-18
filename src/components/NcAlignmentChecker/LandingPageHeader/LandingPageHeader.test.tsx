import { basic } from "./LandingPageHeader.fixtures";

import LandingPageHeader from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("NcAlignmentCheckerLandingPageHeader", () => {
  it("renders correct data", () => {
    const { baseElement } = render(<LandingPageHeader {...basic} />);

    expect(baseElement).toMatchSnapshot();
    expect(baseElement.querySelector("h1")).toHaveTextContent(basic.title);
  });
});
