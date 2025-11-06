import { WhoAreWeBreakout } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeBreakout", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <WhoAreWeBreakout
        content="TESTING_CONTENT"
        imageUrl="http://example.com"
        imageAlt="test"
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByRole("img");
    expect(imageEl).toHaveAttribute(
      "src",
      "http://localhost/_next/image?url=http%3A%2F%2Fexample.com&w=3840&q=75",
    );
    expect(imageEl).toHaveAttribute("alt", "test");
  });
});
