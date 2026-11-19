import { basic as fixture } from "./LandingPageQuotes.fixtures";

import NcAlignmentCheckerLandingPageQuotes from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("NcAlignmentCheckerLandingPageQuotes", () => {
  test("it renders correct data", () => {
    const { baseElement } = render(
      <NcAlignmentCheckerLandingPageQuotes {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
