import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Hr from "./Hr";

describe("Hr", () => {
  test("should render a 'separator'", () => {
    const { getByRole } = renderWithTheme(<Hr />);
    expect(getByRole("separator")).toBeInTheDocument();
  });
});
