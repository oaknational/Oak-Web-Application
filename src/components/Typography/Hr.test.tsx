import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Hr from "./Hr";

const render = renderWithProviders();

describe("Hr", () => {
  test("should render a 'separator'", () => {
    const { getByTestId } = render(<Hr />);
    expect(getByTestId("hr")).toBeInTheDocument();
  });
});
