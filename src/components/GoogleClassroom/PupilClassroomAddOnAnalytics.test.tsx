import { render } from "@testing-library/react";

import { PupilClassroomAddOnAnalytics } from "./PupilClassroomAddOnAnalytics";

import { AnalyticsUseCase } from "@/browser-lib/avo/Avo";
import { useGoogleClassroomContext } from "@/components/GoogleClassroom/useGoogleClassroomContext";
import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

jest.mock("@/components/GoogleClassroom/useGoogleClassroomContext");
jest.mock("@/components/GoogleClassroom/useGoogleClassroomAnalytics");

const trackAddOnOpenedOnce = jest.fn();
const clearAddOnOpenedFlag = jest.fn();

const mockedContext = useGoogleClassroomContext as jest.Mock;
const mockedAnalytics = useGoogleClassroomAnalytics as unknown as jest.Mock;

const setContext = (overrides: Record<string, unknown>) =>
  mockedContext.mockReturnValue({
    isGoogleClassroomContext: false,
    isClassroomAssignment: false,
    classroomAssignmentChecked: true,
    courseId: null,
    itemId: null,
    attachmentId: null,
    googleLoginHint: "",
    clientEnvironment: "web-browser",
    classroomAssignmentId: null,
    ...overrides,
  });

describe("PupilClassroomAddOnAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAnalytics.mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({ trackAddOnOpenedOnce, clearAddOnOpenedFlag }),
    );
  });

  it("fires classroomAddOnOpened (pupil) for a Google Classroom assignment", () => {
    setContext({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });

    render(<PupilClassroomAddOnAnalytics />);

    expect(trackAddOnOpenedOnce).toHaveBeenCalledWith({
      analyticsUseCase: AnalyticsUseCase.PUPIL,
    });
  });

  it("does not fire for a non-Classroom pupil", () => {
    setContext({ isClassroomAssignment: false });

    render(<PupilClassroomAddOnAnalytics />);

    expect(trackAddOnOpenedOnce).not.toHaveBeenCalled();
  });

  it("does not fire until the assignment check has settled", () => {
    setContext({
      isClassroomAssignment: true,
      classroomAssignmentChecked: false,
    });

    render(<PupilClassroomAddOnAnalytics />);

    expect(trackAddOnOpenedOnce).not.toHaveBeenCalled();
  });

  it("clears the once-per-open flag on page hide", () => {
    setContext({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });

    render(<PupilClassroomAddOnAnalytics />);
    globalThis.window.dispatchEvent(new Event("pagehide"));

    expect(clearAddOnOpenedFlag).toHaveBeenCalled();
  });
});
