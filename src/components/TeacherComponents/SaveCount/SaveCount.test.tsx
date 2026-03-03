import { screen } from "@testing-library/dom";

import { SaveCount } from "./SaveCount";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: jest.fn(() => ({
    data: 10,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe("SaveCount", () => {
  const renderer = renderWithProviders();

  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });
  it("renders the save count", () => {
    renderer(<SaveCount />);
    const link = screen.getByRole("link", {
      name: "My library: 10 saved units",
    });
    expect(link.textContent).toContain("My library");
    expect(link.textContent).toContain("(10)");
  });
  it('links to the "my-library" page', () => {
    renderer(<SaveCount />);
    const link = screen.getByRole("link", {
      name: "My library: 10 saved units",
    });
    expect(link).toHaveAttribute("href", "/teachers/my-library");
  });
  it("clears count when a user signs out", () => {
    const { rerender } = renderer(<SaveCount />);
    const link = screen.getByRole("link", {
      name: "My library: 10 saved units",
    });
    expect(link.textContent).toContain("(10)");
    setUseUserReturn(mockLoggedOut);
    rerender(<SaveCount />);

    expect(
      screen.getByRole("link", {
        name: "My library",
      }),
    ).not.toContain("(10)");
  });
});
