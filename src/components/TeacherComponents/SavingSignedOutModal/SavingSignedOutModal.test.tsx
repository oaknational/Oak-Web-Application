import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SavingSignedOutModal from "./SavingSignedOutModal";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  defaultCopyrightRequirements,
  signedInNotOnboarded,
  signedOutLoginRequired,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedOut } from "@/__tests__/__helpers__/mockUser";

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  SignInButton: jest.fn(({ children }) => children),
}));
let mockUseComplexCopyright = defaultCopyrightRequirements;
jest.mock("@/utils/complexCopyright/useComplexCopyright", () => ({
  useComplexCopyright: () => mockUseComplexCopyright,
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

const renderModal = (isOpen: boolean, onClose: () => void) =>
  renderWithProviders()(
    <SavingSignedOutModal
      isOpen={isOpen}
      onClose={onClose}
      componentType="unit_listing_save_button"
    />,
  );

describe("SavingSignedOutModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    setUseUserReturn(mockLoggedOut);
  });

  it("should render the modal when isOpen is true", () => {
    renderModal(true, mockOnClose);

    const modal = screen.getByText("Saving is here");
    expect(modal).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    const { queryByText } = renderModal(false, mockOnClose);

    expect(queryByText("Saving is here")).not.toBeInTheDocument();
  });

  it("should render the sign up button when user is signed out", () => {
    mockUseComplexCopyright = signedOutLoginRequired;
    renderModal(true, mockOnClose);

    const signUpButton = screen.getByText("Sign up");

    expect(signUpButton).toBeInTheDocument();
  });

  it("tracks sign in started when the sign up button is clicked", async () => {
    mockUseComplexCopyright = signedOutLoginRequired;
    renderModal(true, mockOnClose);

    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(mockSignInStarted).toHaveBeenCalledTimes(1);
    expect(mockSignInStarted).toHaveBeenCalledWith({
      componentType: "unit_listing_save_button",
    });
  });

  it("should render the Finish sign up button when user is signed in but not onboarded", () => {
    mockUseComplexCopyright = signedInNotOnboarded;
    renderModal(true, mockOnClose);

    const finishSignUpButton = screen.getByText("Finish sign up");
    expect(finishSignUpButton).toBeInTheDocument();
  });

  it("should call onClose when the modal is closed", async () => {
    renderModal(true, mockOnClose);

    const closeButton = screen.getByTestId("close-button");

    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
