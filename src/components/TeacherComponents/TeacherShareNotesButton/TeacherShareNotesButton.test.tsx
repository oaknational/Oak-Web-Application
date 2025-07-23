import { ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { TeacherShareNotesButton } from "./TeacherShareNotesButton";

// Mock the imported components
jest.mock("@oaknational/oak-components", () => ({
  OakSmallSecondaryButton: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock(
  "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton",
  () => ({
    TeacherShareButton: ({
      label,
      shareUrl,
    }: {
      label: string;
      shareUrl: string;
    }) => (
      <button data-testid="share-button" data-share-url={shareUrl}>
        {label}
      </button>
    ),
  }),
);

jest.mock(
  "@/components/TeacherComponents/TeacherShareButton/useTeacherShareButton",
  () => ({
    useTeacherShareButton: () => ({
      handleClick: jest.fn(),
      copiedComponent: <div>Link copied to clipboard</div>,
    }),
  }),
);

const mockUseOakConsent = jest.fn();
jest.mock("@oaknational/oak-consent-client", () => ({
  useOakConsent: () => mockUseOakConsent(),
}));

const mockUseCopyrightRequirements = {
  showSignedOutGeoRestricted: false,
  showSignedOutLoginRequired: false,
  showGeoBlocked: false,
};
jest.mock("@/hooks/useCopyrightRequirements", () => ({
  useCopyrightRequirements: () => mockUseCopyrightRequirements,
}));

describe("TeacherShareNotesButton", () => {
  const defaultProps = {
    isEditable: false,
    noteSaved: false,
    loginRequired: false,
    geoRestricted: false,
    setTeacherNotesOpen: jest.fn(),
    onTeacherNotesOpen: jest.fn(),
    shareUrl: "https://example.com/share",
    shareActivated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOakConsent.mockReturnValue({
      state: {
        policyConsents: [
          { policyType: "essential", consentState: "granted" },
          { policyType: "non-essential", consentState: "granted" },
        ],
        requiresInteraction: false,
      },
    });
  });

  it("is rendered and enabled when cookies are accepted", () => {
    mockUseOakConsent.mockReturnValue({
      state: {
        policyConsents: [
          { policyType: "essential", consentState: "granted" },
          { policyType: "non-essential", consentState: "granted" },
        ],
        requiresInteraction: false,
      },
    });

    render(
      <TeacherShareNotesButton
        {...defaultProps}
        isEditable={true}
        noteSaved={false}
      />,
    );

    const button = screen.getByText("Add teacher note and share");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("is rendered and disabled when cookies are rejected", () => {
    mockUseOakConsent.mockReturnValue({
      state: {
        policyConsents: [
          { policyType: "essential", consentState: "granted" },
          { policyType: "non-essential", consentState: "denied" },
        ],
        requiresInteraction: false,
      },
    });

    render(
      <TeacherShareNotesButton
        {...defaultProps}
        isEditable={true}
        noteSaved={false}
      />,
    );

    const button = screen.getByText("Add teacher note and share");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("is hidden when cookies have not been accepted/rejected", () => {
    mockUseOakConsent.mockReturnValue({
      state: {
        policyConsents: [
          { policyType: "essential", consentState: "pending" },
          { policyType: "non-essential", consentState: "pending" },
        ],
        requiresInteraction: true,
      },
    });

    render(<TeacherShareNotesButton {...defaultProps} isEditable={true} />);

    expect(
      screen.queryByText("Add teacher note and share"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Edit teacher note and share"),
    ).not.toBeInTheDocument();
  });

  it("renders 'Edit teacher note and share' button when note is saved", () => {
    render(
      <TeacherShareNotesButton
        {...defaultProps}
        isEditable={true}
        noteSaved={true}
      />,
    );

    expect(screen.getByText("Edit teacher note and share")).toBeInTheDocument();
  });

  it("calls setTeacherNotesOpen when clicked", () => {
    const onTeacherNotesOpen = jest.fn();
    render(
      <TeacherShareNotesButton
        {...defaultProps}
        isEditable={true}
        onTeacherNotesOpen={onTeacherNotesOpen}
      />,
    );

    fireEvent.click(screen.getByText("Add teacher note and share"));
    expect(onTeacherNotesOpen).toHaveBeenCalled();
  });

  it("renders the share button when isEditable is false", () => {
    render(<TeacherShareNotesButton {...defaultProps} isEditable={false} />);

    expect(
      screen.queryByText("Share resources with colleague"),
    ).toBeInTheDocument();
  });

  it("redirects to sign up when content is restricted and user is not signed in", () => {
    mockUseCopyrightRequirements.showSignedOutLoginRequired = true;
    const { getByText } = render(<TeacherShareNotesButton {...defaultProps} />);
    const shareButton = getByText("Share resources with colleague");
    shareButton.click();
    expect(defaultProps.onTeacherNotesOpen).not.toHaveBeenCalled();
  });

  it("does not render when signed in and not region authorised", () => {
    mockUseCopyrightRequirements.showGeoBlocked = true;
    const { queryByTestId } = render(
      <TeacherShareNotesButton {...defaultProps} />,
    );
    const shareButton = queryByTestId("share-button");
    expect(shareButton).not.toBeInTheDocument();
  });
});
