import { WhoAreWeHeader } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getByAltText } = render(
      <WhoAreWeHeader
        title="TESTING_TITLE"
        content={[
          {
            _key: "key0001",
            _type: "block",
            children: [
              {
                _key: "key0002",
                _type: "span",
                marks: [],
                text: "TESTING_CONTENT",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ]}
        imageUrl="http://example.com/image.svg"
        imageAlt="Oak logo"
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByAltText("Oak logo");
    expect(imageEl).toHaveAttribute("src", "http://example.com/image.svg");
    expect(imageEl).toHaveAttribute("alt", "Oak logo");
  });
});
