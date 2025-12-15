import { AboutSharedHeader } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("AboutSharedHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getByAltText } = render(
      <AboutSharedHeader
        title="TESTING_TITLE"
        content="TESTING_CONTENT"
        // imageUrl="http://example.com/image.svg"
        // imageAlt="Oak logo"
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByAltText("Oak logo");
    expect(imageEl).toHaveAttribute("src", "http://example.com/image.svg");
    expect(imageEl).toHaveAttribute("alt", "Oak logo");
  });

  it("renders correctly with no image", () => {
    const { baseElement, getByRole, getByAltText } = render(
      <AboutSharedHeader title="TESTING_TITLE" content="TESTING_CONTENT" />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByAltText("Background looping line");
    expect(imageEl).toHaveAttribute("alt", "Background looping line");
  });
});
