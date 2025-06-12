import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import LoginRequiredButton from "./LoginRequiredButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockGeorestrictedUser,
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
  mockNotOnboardedUser,
} from "@/__tests__/__helpers__/mockUser";

const render = renderWithProviders();

describe("LoginRequiredButton", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedOut);
  });
  it("should render a sign up button", () => {
    render(<LoginRequiredButton />);
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
  it("should render an onboarding button", () => {
    setUseUserReturn(mockNotOnboardedUser);
    render(<LoginRequiredButton />);
    expect(
      screen.getByRole("button", { name: /complete sign up to continue/i }),
    ).toBeInTheDocument();
  });
  it("should render a loading button", () => {
    setUseUserReturn(mockLoadingUser);
    render(<LoginRequiredButton />);
    expect(
      screen.getByRole("button", { name: /loading.../i }),
    ).toBeInTheDocument();
  });
  it("should render an action button", async () => {
    setUseUserReturn(mockLoggedIn);
    const mockOnClick = jest.fn();
    render(
      <LoginRequiredButton
        actionProps={{
          name: "Action",
          onClick: mockOnClick,
          isActionGeorestricted: false,
        }}
      />,
    );
    const actionButton = screen.getByRole("button", { name: /action/i });
    expect(actionButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(actionButton);
    expect(mockOnClick).toHaveBeenCalled();
  });
  it("renders alternate sign in text", () => {
    render(
      <LoginRequiredButton signUpProps={{ name: "Register to continue" }} />,
    );
    const signUpButton = screen.getByRole("button", {
      name: /register to continue/i,
    });
    expect(signUpButton).toBeInTheDocument();
    const defaultTextSignUpButton = screen.queryByRole("button", {
      name: /sign up/i,
    });
    expect(defaultTextSignUpButton).not.toBeInTheDocument();
  });
  it('renders a disabled button when "georestricted"', () => {
    setUseUserReturn(mockGeorestrictedUser);
    render(
      <LoginRequiredButton
        actionProps={{
          name: "Download",
          onClick: jest.fn,
          isActionGeorestricted: true,
        }}
      />,
    );
    const disabledButton = screen.getByRole("button", { name: /download/i });
    expect(disabledButton).toBeDisabled();
  });
  it("renders a primary variant", () => {
    render(<LoginRequiredButton buttonVariant="primary" />);
    const primaryButton = screen.getByRole("button", { name: /sign up/i });
    expect(primaryButton).toHaveStyle("background-color: #222222");
  });
  it("renders a secondary variant", () => {
    render(<LoginRequiredButton buttonVariant="secondary" />);
    const secondaryButton = screen.getByRole("button", { name: /sign up/i });
    expect(secondaryButton).toHaveStyle("background-color: #ffffff");
  });
  it("renders a tertiary variant", () => {
    render(<LoginRequiredButton buttonVariant="tertiary" />);
    const tertiaryButton = screen.getByRole("button", { name: /sign up/i });
    expect(tertiaryButton).toHaveStyle("background: none");
  });
});
