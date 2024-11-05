import Banners from "./Banners";

import render from "@/__tests__/__helpers__/renderWithTheme";

const isCycleTwoEnabled = jest.fn(() => false);
jest.mock("@/utils/curriculum/features", () => ({
  __esModule: true,
  isCycleTwoEnabled: (...args: []) => isCycleTwoEnabled(...args),
  default: {},
}));

describe("Banners", () => {
  test("when cycle 2 not enabled", async () => {
    isCycleTwoEnabled.mockReturnValue(false);
    const { container } = render(<Banners />);
    expect(container.innerHTML).toBe("");
  });
  test("when cycle 2 enabled", async () => {
    isCycleTwoEnabled.mockReturnValue(true);
    const { container } = render(<Banners />);
    expect(container).toHaveTextContent("See curriculum plans");
    expect(container).toMatchSnapshot();
  });
});
