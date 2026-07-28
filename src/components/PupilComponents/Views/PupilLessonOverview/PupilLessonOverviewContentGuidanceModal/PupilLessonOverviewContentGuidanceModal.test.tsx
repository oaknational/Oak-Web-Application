import userEvent from "@testing-library/user-event";

import { PupilLessonOverviewContentGuidanceModal } from "./PupilLessonOverviewContentGuidanceModal";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { ContentGuidanceWarningValueType } from "@/browser-lib/avo/Avo";

const render = renderWithProvidersByName(["oakTheme"]);

const contentGuidance = [
  {
    contentguidanceLabel: "Scenes of conflict",
    contentguidanceArea: "Violence",
    contentguidanceDescription: "Contains references to conflict.",
  },
];

const defaultProps = {
  redirectOverlayCleared: true,
  contentGuidanceDismissed: false,
  contentGuidanceCanOpen: true,
  contentGuidance,
  supervisionLevel: "Adult supervision recommended",
  ageRestriction: null,
  isClassroomAssignment: false,
  onAccept: jest.fn(),
  onDecline: jest.fn(),
};

describe("PupilLessonOverviewContentGuidanceModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders content guidance when the redirected overlay has cleared", () => {
    render(<PupilLessonOverviewContentGuidanceModal {...defaultProps} />);

    const dialog = document.querySelector('[role="alertdialog"]');

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Scenes of conflict");
    expect(dialog).toHaveTextContent("Adult supervision recommended");
  });

  it("does not render before the redirected overlay has cleared", () => {
    render(
      <PupilLessonOverviewContentGuidanceModal
        {...defaultProps}
        redirectOverlayCleared={false}
      />,
    );

    expect(
      document.querySelector('[role="alertdialog"]'),
    ).not.toBeInTheDocument();
  });

  it("does not render once content guidance has been dismissed", () => {
    render(
      <PupilLessonOverviewContentGuidanceModal
        {...defaultProps}
        contentGuidanceDismissed
      />,
    );

    expect(
      document.querySelector('[role="alertdialog"]'),
    ).not.toBeInTheDocument();
  });

  it("does not render until content guidance can open", () => {
    render(
      <PupilLessonOverviewContentGuidanceModal
        {...defaultProps}
        contentGuidanceCanOpen={false}
      />,
    );

    expect(
      document.querySelector('[role="alertdialog"]'),
    ).not.toBeInTheDocument();
  });

  it("calls onAccept with tracking args", async () => {
    const user = userEvent.setup();
    const onAccept = jest.fn();

    render(
      <PupilLessonOverviewContentGuidanceModal
        {...defaultProps}
        onAccept={onAccept}
      />,
    );

    await user.click(document.querySelector('[data-testid="acceptButton"]')!);

    expect(onAccept).toHaveBeenCalledWith({
      supervisionLevel: "Adult supervision recommended",
      contentGuidanceWarning: "Violence" as ContentGuidanceWarningValueType,
      ageRestriction: "all",
    });
  });

  it("calls onDecline with tracking args", async () => {
    const user = userEvent.setup();
    const onDecline = jest.fn();

    render(
      <PupilLessonOverviewContentGuidanceModal
        {...defaultProps}
        onDecline={onDecline}
      />,
    );

    await user.click(document.querySelector('[data-testid="declineButton"]')!);

    expect(onDecline).toHaveBeenCalledWith({
      supervisionLevel: "Adult supervision recommended",
      contentGuidanceWarning: "Violence" as ContentGuidanceWarningValueType,
      ageRestriction: "all",
    });
  });

  it("renders default guidance for age restricted lessons without content guidance", () => {
    render(
      <PupilLessonOverviewContentGuidanceModal
        {...defaultProps}
        contentGuidance={null}
        supervisionLevel={null}
        ageRestriction="7_and_above"
      />,
    );

    const dialog = document.querySelector('[role="alertdialog"]');

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(
      "To view this lesson, you must be in year 7 and above",
    );
    expect(dialog).toHaveTextContent(
      "Speak to an adult before starting this lesson.",
    );
  });
});
