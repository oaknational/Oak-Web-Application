import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SavingSignedOutModal from "./SavingSignedOutModal";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  SignUpButton: jest.fn(() => <button>Sign up</button>),
}));

describe("SavingSignedOutModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    setUseUserReturn(mockLoggedOut);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the modal when isOpen is true", () => {
    renderWithProviders()(
      <SavingSignedOutModal isOpen={true} onClose={mockOnClose} />,
    );

    const modal = screen.getByText("Saving is here");
    expect(modal).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    const { queryByText } = renderWithProviders()(
      <SavingSignedOutModal isOpen={false} onClose={mockOnClose} />,
    );

    expect(queryByText("Saving is here")).not.toBeInTheDocument();
  });

  it("should render the sign up button when user is signed out", () => {
    renderWithProviders()(
      <SavingSignedOutModal isOpen={true} onClose={mockOnClose} />,
    );

    const signUpButton = screen.getByText("Sign up");

    expect(signUpButton).toBeInTheDocument();
  });

  it("should render the Finish sign up button when user is signed in but not onboarded", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockLoggedIn.user,
        publicMetadata: {
          owa: {
            isOnboarded: false,
          },
        },
      },
    });

    renderWithProviders()(
      <SavingSignedOutModal isOpen={true} onClose={mockOnClose} />,
    );

    const finishSignUpButton = screen.getByText("Finish sign up");
    expect(finishSignUpButton).toBeInTheDocument();
  });

  it("should call onClose when the modal is closed", async () => {
    renderWithProviders()(
      <SavingSignedOutModal isOpen={true} onClose={mockOnClose} />,
    );

    const closeButton = screen.getByTestId("close-button");

    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
