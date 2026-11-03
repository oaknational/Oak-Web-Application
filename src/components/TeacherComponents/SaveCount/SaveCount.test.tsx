import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";

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

const mockSignInStarted = jest.fn();
jest.mock(
  "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider",
  () => ({
    ...jest.requireActual(
      "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider",
    ),
    useTeacherBrowseAnalytics: () => ({ signInStarted: mockSignInStarted }),
  }),
);

const clickMyLibrary = async () => {
  const link = screen.getByRole("link", { name: /My library/ });
  link.addEventListener("click", (e) => e.preventDefault());
  await userEvent.setup().click(link);
};

describe("SaveCount", () => {
  const renderer = renderWithProviders();

  beforeEach(() => {
    mockSignInStarted.mockClear();
    jest.mocked(usePathname).mockReset();
    setUseUserReturn(mockLoggedIn);
  });
  it("tracks sign in started when a signed out user clicks my library", async () => {
    setUseUserReturn(mockLoggedOut);
    jest
      .mocked(usePathname)
      .mockReturnValue(
        "/teachers/programmes/maths-primary-ks2/units/u/lessons",
      );
    renderer(<SaveCount />);

    await clickMyLibrary();

    expect(mockSignInStarted).toHaveBeenCalledTimes(1);
    expect(mockSignInStarted).toHaveBeenCalledWith({
      componentType: "topnav_my_library_button",
      accessLevel: "unit",
    });
  });
  it("does not track sign in started when a signed in user clicks my library", async () => {
    renderer(<SaveCount />);

    await clickMyLibrary();

    expect(mockSignInStarted).not.toHaveBeenCalled();
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
    expect(link).toHaveTextContent("(10)");
    setUseUserReturn(mockLoggedOut);
    rerender(<SaveCount />);

    expect(
      screen.getByRole("link", {
        name: "My library",
      }),
    ).not.toHaveTextContent("(10)");
  });
});
