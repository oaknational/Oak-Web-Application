import Home from "../../pages/index";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/index.tsx", () => {
  it("renders homepage unchanged", () => {
    const { container } = renderWithProviders(<Home />);
    expect(container).toMatchSnapshot();
  });
});
