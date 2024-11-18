import Banners from "./Banners";

import render from "@/__tests__/__helpers__/renderWithTheme";

describe("Banners", () => {
  test("when cycle 2 enabled", async () => {
    const { container } = render(<Banners />);
    expect(container).toHaveTextContent("See curriculum plans");
    expect(container).toMatchSnapshot();
  });
});
