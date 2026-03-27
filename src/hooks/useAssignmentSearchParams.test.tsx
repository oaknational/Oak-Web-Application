import { renderHook, waitFor } from "@testing-library/react";

import { useAssignmentSearchParams } from "./useAssignmentSearchParams";

const useSearchParamsMock = jest.fn();
const useRouterMock = jest.fn();
const isClassroomAssignmentMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock("next/compat/router", () => ({
  __esModule: true,
  useRouter: () => useRouterMock(),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  __esModule: true,
  isClassroomAssignment: (...args: unknown[]) =>
    isClassroomAssignmentMock(...args),
}));

describe("useAssignmentSearchParams", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("courseId=course-1&itemId=item-1"),
    );
    isClassroomAssignmentMock.mockReturnValue(true);
  });

  it("works without a pages router mounted", async () => {
    useRouterMock.mockReturnValue(null);

    const { result } = renderHook(() => useAssignmentSearchParams());

    await waitFor(() => {
      expect(result.current).toEqual({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
    });

    expect(isClassroomAssignmentMock).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
    );
  });

  it("waits for the compat router to be ready in pages-router contexts", async () => {
    useRouterMock.mockReturnValue({ isReady: false });

    const { result, rerender } = renderHook(() => useAssignmentSearchParams());

    expect(result.current).toEqual({
      isClassroomAssignment: null,
      classroomAssignmentChecked: false,
    });
    expect(isClassroomAssignmentMock).not.toHaveBeenCalled();

    useRouterMock.mockReturnValue({ isReady: true });
    rerender();

    await waitFor(() => {
      expect(result.current).toEqual({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
    });
  });
});
