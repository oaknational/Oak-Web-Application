import { act, renderHook } from "@testing-library/react";

import {
  ProgrammePageFiltersModalProvider,
  useProgrammePageFiltersModal,
} from "./ProgrammePageFiltersModalProvider";

describe("ProgrammePageFiltersModalProvider", () => {
  it("throws when useProgrammePageFiltersModal is used outside the provider", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useProgrammePageFiltersModal())).toThrow(
      "useProgrammePageFiltersModal must be used within ProgrammePageFiltersModalProvider",
    );
  });

  it("exposes isOpen as false by default and updates via setIsOpen", () => {
    const { result } = renderHook(() => useProgrammePageFiltersModal(), {
      wrapper: ProgrammePageFiltersModalProvider,
    });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsOpen(false);
    });

    expect(result.current.isOpen).toBe(false);
  });
});
