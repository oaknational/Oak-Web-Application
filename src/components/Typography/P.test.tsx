import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import P from "./P";

describe("P", () => {
  test("should set the correct font-family", () => {
    const { getByTestId } = renderWithProviders(
      <P data-testid="paragraph">Here is some paragraph text</P>
    );
    expect(getByTestId("paragraph")).toHaveStyle(
      "font-family: ABeeZee,sans-serif"
    );
  });
});
