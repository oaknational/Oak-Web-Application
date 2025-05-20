import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import AppHeader from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(() => "with-login"),
}));

describe("components/AppHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("header should be in the document", () => {
    const { getByRole } = render(<AppHeader />);

    expect(getByRole("banner")).toBeInTheDocument();
  });

  test("it should be the teachers header colour", () => {
    const { getByTestId } = render(<AppHeader />);

    expect(getByTestId("app-header")).toHaveStyle(
      "background-color: rgb(255, 255, 255);",
    );
  });

  test("clicking on the hamburger button opens the menu", async () => {
    const { getByLabelText, getByTestId } = render(<AppHeader />);

    const user = userEvent.setup();
    const hamburgerButton = getByLabelText("Menu");
    expect(getByTestId("menu")).not.toBeVisible();

    await user.click(hamburgerButton);
    expect(getByTestId("menu")).toBeVisible();
  });

  test("menu can be opened from keyboard", async () => {
    render(<AppHeader />);

    const user = userEvent.setup();
    expect(screen.getByTestId("menu")).not.toBeVisible();
    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("menu")).toBeVisible();
  });

  test("menu does not show old menu sections", async () => {
    render(<AppHeader />);
    const user = userEvent.setup();
    const hamburgerButton = screen.getByLabelText("Menu");
    await user.click(hamburgerButton);

    const oldMenuLink = screen.queryByText("Classroom");
    expect(oldMenuLink).not.toBeInTheDocument();
  });

  test("it should include a link for new teacher experience", () => {
    render(<AppHeader />);
    const teacherLink = screen.getAllByRole("link")[1];

    if (!teacherLink) {
      throw new Error("Failed to find link to teacher experience");
    }

    expect(teacherLink.closest("a")).toHaveAttribute("href", "/teachers");
  });
  test("it should include a link for classroom", () => {
    render(<AppHeader />);
    const pupilsLink = screen.getAllByRole("link")[2];

    if (!pupilsLink) {
      throw new Error("Failed to find link to classroom");
    }

    expect(pupilsLink.closest("a")).toHaveAttribute("href", "/pupils/years");
  });

  it("does not render a sign out button when user is not logged in", () => {
    setUseUserReturn(mockLoggedOut);
    renderWithProviders()(<AppHeader />);

    const signOutButton = screen.queryByTestId("clerk-user-button");
    expect(signOutButton).not.toBeInTheDocument();
  });

  it("renders a sign out button when a user is logged in", async () => {
    setUseUserReturn(mockLoggedIn);
    renderWithProviders()(<AppHeader />);

    const signOutButton = screen.getByTestId("clerk-user-button");
    expect(signOutButton).toBeInTheDocument();
  });

  it("renders a sign up button when a user is not logged in", async () => {
    setUseUserReturn(mockLoggedOut);
    renderWithProviders()(<AppHeader />);

    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
  });

  it("does not render a sign up button when a user is logged in", async () => {
    setUseUserReturn(mockLoggedIn);
    renderWithProviders()(<AppHeader />);

    const signUpButton = screen.queryByRole("button", { name: /sign up/i });
    expect(signUpButton).not.toBeInTheDocument();
  });
});
