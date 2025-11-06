import { WhoAreWeHeader } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <WhoAreWeHeader
        title="TESTING_TITLE"
        content="TESTING_CONTENT"
        imageUrl="http://example.com/image.svg"
        imageAlt="Oak logo"
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByRole("img");
    expect(imageEl).toHaveAttribute("src", "http://example.com/image.svg");
    expect(imageEl).toHaveAttribute("alt", "Oak logo");
  });
});
