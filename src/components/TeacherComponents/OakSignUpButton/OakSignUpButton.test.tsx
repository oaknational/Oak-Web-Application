import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import OakSignUpButton from "./OakSignUpButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
  mockNotOnboardedUser,
} from "@/__tests__/__helpers__/mockUser";

const render = renderWithProviders();

describe("Sign up button", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedOut);
  });
  it("should render a sign up button", () => {
    render(<OakSignUpButton />);
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
  it("should render an onboarding button", () => {
    setUseUserReturn(mockNotOnboardedUser);
    render(<OakSignUpButton />);
    expect(
      screen.getByRole("button", { name: /complete sign up to continue/i }),
    ).toBeInTheDocument();
  });
  it("should render a loading button", () => {
    setUseUserReturn(mockLoadingUser);
    render(<OakSignUpButton />);
    expect(
      screen.getByRole("button", { name: /loading.../i }),
    ).toBeInTheDocument();
  });
  it("should render an action button", async () => {
    setUseUserReturn(mockLoggedIn);
    const mockOnClick = jest.fn();
    render(
      <OakSignUpButton
        actionProps={{ name: "Action", onClick: mockOnClick }}
      />,
    );
    const actionButton = screen.getByRole("button", { name: /action/i });
    expect(actionButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(actionButton);
    expect(mockOnClick).toHaveBeenCalled();
  });
  it("renders alternate sign in text", () => {
    render(<OakSignUpButton signInText="Register to continue" />);
    const signUpButton = screen.getByRole("button", {
      name: /register to continue/i,
    });
    expect(signUpButton).toBeInTheDocument();
    const defaultTextSignUpButton = screen.queryByRole("button", {
      name: /sign up/i,
    });
    expect(defaultTextSignUpButton).not.toBeInTheDocument();
  });
  it.todo("renders a primary variant");
  it.todo("renders a secondary variant");
  it.todo("renders a tertiary variant");
});
