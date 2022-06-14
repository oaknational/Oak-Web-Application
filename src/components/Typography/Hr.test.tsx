import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Hr from "./Hr";

describe("Hr", () => {
  test("should render a 'separator'", () => {
    const { getByRole } = renderWithProviders(<Hr />);
    expect(getByRole("separator")).toBeInTheDocument();
  });
});
