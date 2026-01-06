import { OakImage } from "@oaknational/oak-components";

import { AboutSharedHeader, BackgroundHeaderLoop } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("AboutSharedHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getByAltText } = render(
      <AboutSharedHeader title="TESTING_TITLE" content="TESTING_CONTENT">
        <OakImage src="http://example.com/image.svg" alt="Oak logo" />
      </AboutSharedHeader>,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByAltText("Oak logo");
    expect(imageEl).toHaveAttribute("src", "http://example.com/image.svg");
    expect(imageEl).toHaveAttribute("alt", "Oak logo");
  });

  it("renders correctly with loop illustration", () => {
    const { baseElement, getByRole, getByTestId } = render(
      <AboutSharedHeader title="TESTING_TITLE" content="TESTING_CONTENT">
        <BackgroundHeaderLoop />
      </AboutSharedHeader>,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByTestId("about-shared-loop");
    expect(imageEl).toHaveAttribute("data-testid", "about-shared-loop");
  });
});
