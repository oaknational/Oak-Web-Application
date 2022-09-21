import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Hr from "./Hr";

describe("Hr", () => {
  test("should render a 'separator'", () => {
    const { getByTestId } = renderWithProviders(<Hr />);
    expect(getByTestId("hr")).toBeInTheDocument();
  });
});
