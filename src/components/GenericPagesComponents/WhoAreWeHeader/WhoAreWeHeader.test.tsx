import { WhoAreWeHeader } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <WhoAreWeHeader
        title="TESTING_TITLE"
        content="TESTING_CONTENT"
        cloudinaryId="TESTING_IMAGE"
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    expect(getByRole("img")).toHaveAttribute("src", "TESTING_IMAGE");
  });
});
