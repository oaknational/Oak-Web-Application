import { act, renderHook, waitFor } from "@testing-library/react";

import { useSaveUnits } from "./useSaveUnits";

import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

const mockSetOakToastProps = jest.fn();

jest.mock("@/context/OakToast/useOakToastContext", () => ({
  useOakToastContext: jest.fn(() => ({
    setCurrentToastProps: (props: unknown) => mockSetOakToastProps(props),
  })),
}));

const mockUseGetEducatorData = jest.fn();

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: () => mockUseGetEducatorData(),
}));

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

describe("useSaveUnits", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValue({ ok: true });
    setUseUserReturn(mockLoggedIn);
  });
  it("should return correct response for isUnitSaved", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: ["unit1", "unit2"],
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useSaveUnits("test-programme"));

    expect(result.current.isUnitSaved("unit1")).toBe(true);
    expect(result.current.isUnitSaved("unit2")).toBe(true);
    expect(result.current.isUnitSaved("unit3")).toBe(false);
  });
  it("should save a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useSaveUnits("test-programme"));

    expect(result.current.isUnitSaved("unit1")).toBe(false);

    act(() => result.current.onSaveToggle("unit1"));

    expect(result.current.isUnitSaved("unit1")).toBe(true);
  });
  it("should unsave when toggling a unit that is already saved", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useSaveUnits("test-programme"));

    act(() => result.current.onSaveToggle("unit1"));
    act(() => result.current.onSaveToggle("unit1"));

    expect(result.current.isUnitSaved("unit1")).toBe(false);
  });
  it("should set the toast success variant when saving a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useSaveUnits("test-programme"));

    await act(async () => result.current.onSaveToggle("unit1"));

    expect(mockSetOakToastProps).toHaveBeenCalledWith({
      message: expect.any(Object),
      variant: "green",
      showIcon: true,
      autoDismiss: true,
    });
  });
  it("should set the toast error variant when saving a unit fails", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
    }));

    fetch.mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useSaveUnits("test-programme"));

    await act(async () => result.current.onSaveToggle("unit1"));

    await waitFor(() => expect(mockSetOakToastProps).toHaveBeenCalledTimes(2));
    expect(mockSetOakToastProps).toHaveBeenLastCalledWith({
      message: expect.any(Object),
      variant: "error",
      showIcon: false,
      autoDismiss: true,
    });
  });
});
