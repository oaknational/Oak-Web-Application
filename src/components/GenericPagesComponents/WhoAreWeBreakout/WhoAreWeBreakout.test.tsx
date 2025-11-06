import { WhoAreWeBreakout } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeBreakout", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <WhoAreWeBreakout
        content="TESTING_CONTENT"
        cloudinaryId="TESTING_IMAGE"
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    // expect(getByRole("img")).toHaveAttribute("src", "TESTING_IMAGE");
  });
});
