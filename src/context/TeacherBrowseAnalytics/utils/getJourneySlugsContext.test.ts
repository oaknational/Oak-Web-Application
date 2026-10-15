import { renderHook } from "@testing-library/react";

import useJourneySlugsContext, {
  getProgrammeSlugFromPathname,
} from "./getJourneySlugsContext";

const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("getProgrammeSlugFromPathname", () => {
  it("extracts a subject-phase slug", () => {
    expect(
      getProgrammeSlugFromPathname(
        "/teachers/programmes/english-secondary-aqa/units",
      ),
    ).toBe("english-secondary-aqa");
  });

  it("extracts a full programme slug", () => {
    expect(
      getProgrammeSlugFromPathname(
        "/teachers/programmes/biology-secondary-ks4-higher-aqa/units",
      ),
    ).toBe("biology-secondary-ks4-higher-aqa");
  });

  it("returns null when no programme slug is present", () => {
    expect(getProgrammeSlugFromPathname("/teachers/my-library")).toBeNull();
    expect(getProgrammeSlugFromPathname(null)).toBeNull();
  });
});

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

  it("derives slugs from a full programme slug", () => {
    mockUsePathname.mockReturnValue(
      "/teachers/programmes/biology-secondary-ks4-higher-aqa/units",
    );

    const { result } = renderHook(() => useJourneySlugsContext());

    expect(result.current).toEqual({
      subjectSlug: "biology",
      phaseSlug: "secondary",
    });
  });

  it("returns unknown slugs when the pathname has no match", () => {
    mockUsePathname.mockReturnValue("/teachers/my-library");

    const { result } = renderHook(() => useJourneySlugsContext());

    expect(result.current).toEqual({
      subjectSlug: "null",
      phaseSlug: "null",
    });
  });

  it("returns unknown slugs for a null/undefined pathname", () => {
    mockUsePathname.mockReturnValue(null);

    const { result } = renderHook(() => useJourneySlugsContext());

    expect(result.current).toEqual({
      subjectSlug: "null",
      phaseSlug: "null",
    });

    mockUsePathname.mockReturnValue(undefined);

    const { result: resultUndefined } = renderHook(() =>
      useJourneySlugsContext(),
    );

    expect(resultUndefined.current).toEqual({
      subjectSlug: "null",
      phaseSlug: "null",
    });
  });
});
