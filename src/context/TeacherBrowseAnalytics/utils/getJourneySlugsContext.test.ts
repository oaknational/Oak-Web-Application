import { renderHook } from "@testing-library/react";

import useJourneySlugsContext from "./getJourneySlugsContext";

const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("useJourneySlugsContext", () => {
  it("derives slugs from the current pathname", () => {
    mockUsePathname.mockReturnValue(
      "/teachers/programmes/english-secondary-aqa/units",
    );

    const { result } = renderHook(() => useJourneySlugsContext());

    expect(result.current).toEqual({
      subjectSlug: "english",
      phaseSlug: "secondary",
    });
  });

  it("returns unknown slugs when the pathname has no match", () => {
    mockUsePathname.mockReturnValue("/teachers/my-library");

    const { result } = renderHook(() => useJourneySlugsContext());

    expect(result.current).toEqual({
      subjectSlug: "unknown",
      phaseSlug: "unknown",
    });
  });

  it("returns unknown slugs for a null/undefined pathname", () => {
    mockUsePathname.mockReturnValue(null);

    const { result } = renderHook(() => useJourneySlugsContext());

    expect(result.current).toEqual({
      subjectSlug: "unknown",
      phaseSlug: "unknown",
    });

    mockUsePathname.mockReturnValue(undefined);

    const { result: resultUndefined } = renderHook(() =>
      useJourneySlugsContext(),
    );

    expect(resultUndefined.current).toEqual({
      subjectSlug: "unknown",
      phaseSlug: "unknown",
    });
  });
});
