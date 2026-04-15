import { renderHook } from "@testing-library/react";

import { useGoogleClassroomContext } from "./useGoogleClassroomContext";

const useSearchParamsMock = jest.fn();
const useAssignmentSearchParamsMock = jest.fn();
const getClientEnvironmentMock = jest.fn();
let addonStoreState = {
  courseId: null as string | null,
  itemId: null as string | null,
  googleLoginHint: null as string | null,
};

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  __esModule: true,
  useGoogleClassroomAddonStore: (
    selector: (state: typeof addonStoreState) => unknown,
  ) => selector(addonStoreState),
}));

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  __esModule: true,
  useAssignmentSearchParams: () => useAssignmentSearchParamsMock(),
}));

jest.mock("@/browser-lib/google-classroom/getClientEnvironment", () => ({
  __esModule: true,
  getClientEnvironment: () => getClientEnvironmentMock(),
}));

describe("useGoogleClassroomContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    addonStoreState = {
      courseId: null,
      itemId: null,
      googleLoginHint: null,
    };
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "courseId=course-1&itemId=item-1&attachmentId=attachment-1&login_hint=hint-1",
      ),
    );
    useAssignmentSearchParamsMock.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    getClientEnvironmentMock.mockReturnValue("iframe");
  });

  it("resolves classroom values from search params", () => {
    const { result } = renderHook(() => useGoogleClassroomContext());

    expect(result.current).toEqual({
      attachmentId: "attachment-1",
      classroomAssignmentChecked: true,
      classroomAssignmentId: "course-1:item-1",
      clientEnvironment: "iframe",
      courseId: "course-1",
      googleLoginHint: "hint-1",
      isClassroomAssignment: true,
      isGoogleClassroomContext: true,
      itemId: "item-1",
    });
  });

  it("prefers addon store values over search params when present", () => {
    addonStoreState = {
      courseId: "addon-course",
      itemId: "addon-item",
      googleLoginHint: "addon-hint",
    };

    const { result } = renderHook(() => useGoogleClassroomContext());

    expect(result.current).toEqual(
      expect.objectContaining({
        classroomAssignmentId: "addon-course:addon-item",
        courseId: "addon-course",
        googleLoginHint: "addon-hint",
        itemId: "addon-item",
      }),
    );
  });

  it("returns a null classroomAssignmentId when either part is missing", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("courseId=course-1"),
    );
    useAssignmentSearchParamsMock.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    getClientEnvironmentMock.mockReturnValue("web-browser");

    const { result } = renderHook(() => useGoogleClassroomContext());

    expect(result.current).toEqual({
      attachmentId: null,
      classroomAssignmentChecked: true,
      classroomAssignmentId: null,
      clientEnvironment: "web-browser",
      courseId: "course-1",
      googleLoginHint: "",
      isClassroomAssignment: false,
      isGoogleClassroomContext: true,
      itemId: null,
    });
  });
});
