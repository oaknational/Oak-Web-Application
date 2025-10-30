import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import LoginRequiredButton from "./LoginRequiredButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import {
  defaultCopyrightRequirements,
  isLoading,
  signedInGeoBlocked,
  signedInNotOnboarded,
  signedOutLoginRequired,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(() => true),
}));

let mockUseComplexCopyright = defaultCopyrightRequirements;
jest.mock("@/hooks/useComplexCopyright", () => ({
  useComplexCopyright: () => mockUseComplexCopyright,
}));

describe("LoginRequiredButton", () => {
  afterEach(() => {
    mockUseComplexCopyright = defaultCopyrightRequirements;
  });
  beforeEach(() => {
    setUseUserReturn(mockLoggedOut);
  });
  it("should render a sign up button", () => {
    mockUseComplexCopyright = signedOutLoginRequired;
    render(<LoginRequiredButton loginRequired={true} geoRestricted={false} />);
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
  it("should render an onboarding button", () => {
    mockUseComplexCopyright = signedInNotOnboarded;
    render(<LoginRequiredButton loginRequired={true} geoRestricted={false} />);
    expect(
      screen.getByRole("button", { name: /complete sign up to continue/i }),
    ).toBeInTheDocument();
  });
  it("should render a loading button", () => {
    mockUseComplexCopyright = isLoading;
    render(<LoginRequiredButton loginRequired={true} geoRestricted={false} />);
    expect(
      screen.getByRole("button", { name: /loading.../i }),
    ).toBeInTheDocument();
  });
  it("should render an action button", async () => {
    const mockOnClick = jest.fn();
    render(
      <LoginRequiredButton
        loginRequired={true}
        geoRestricted={true}
        actionProps={{
          name: "Action",
          onClick: mockOnClick,
          isActionGeorestricted: false,
        }}
      />,
    );
    const actionButton = screen.getByRole("button", { name: /action/i });

    const user = userEvent.setup();
    await user.click(actionButton);
    expect(mockOnClick).toHaveBeenCalled();
  });
  it("renders alternate sign in text", () => {
    mockUseComplexCopyright = signedOutLoginRequired;
    render(
      <LoginRequiredButton
        loginRequired={true}
        geoRestricted={false}
        signUpProps={{ name: "Register to continue" }}
      />,
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
    mockUseComplexCopyright = signedInGeoBlocked;
    render(
      <LoginRequiredButton
        loginRequired={false}
        geoRestricted={true}
        actionProps={{
          name: "Download",
          onClick: jest.fn(),
          isActionGeorestricted: true,
        }}
      />,
    );
    const disabledButton = screen.getByRole("button", { name: /download/i });
    expect(disabledButton).toBeDisabled();
  });
  it("renders nothing when shouldHideWhenGeorestricted is true", () => {
    mockUseComplexCopyright = signedInGeoBlocked;
    render(
      <LoginRequiredButton
        loginRequired={false}
        geoRestricted={true}
        actionProps={{
          name: "Download",
          onClick: jest.fn(),
          isActionGeorestricted: true,
          shouldHidewhenGeoRestricted: true,
        }}
      />,
    );
    const disabledButton = screen.queryByRole("button", { name: /download/i });
    expect(disabledButton).not.toBeInTheDocument();
  });
  it("renders a primary variant", () => {
    mockUseComplexCopyright = signedOutLoginRequired;
    render(
      <LoginRequiredButton
        loginRequired={true}
        geoRestricted={false}
        buttonVariant="primary"
      />,
    );
    const primaryButton = screen.getByRole("button", { name: /sign up/i });
    expect(primaryButton).toHaveStyle("background-color: #222222");
  });
  it("renders a secondary variant", () => {
    mockUseComplexCopyright = signedOutLoginRequired;
    render(
      <LoginRequiredButton
        loginRequired={true}
        geoRestricted={false}
        buttonVariant="secondary"
      />,
    );
    const secondaryButton = screen.getByRole("button", { name: /sign up/i });
    expect(secondaryButton).toHaveStyle("background-color: #ffffff");
  });
  it("renders a tertiary variant", () => {
    mockUseComplexCopyright = signedOutLoginRequired;
    render(
      <LoginRequiredButton
        loginRequired={true}
        geoRestricted={false}
        buttonVariant="tertiary"
      />,
    );
    const tertiaryButton = screen.getByRole("button", { name: /sign up/i });
    expect(tertiaryButton).toHaveStyle("background: none");
  });
});
