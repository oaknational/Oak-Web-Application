import { useRouter, useSearchParams } from "next/navigation";
import { renderHook, act } from "@testing-library/react";

import { useUpdateSearchQuery } from "./useUpdateSearchQuery";

jest.mock("next/navigation");

describe("useUpdateSearchQuery", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("updateSearchTerm calls router.push with the correct url", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("keyStages=ks1"),
    );

    const { result } = renderHook(() => useUpdateSearchQuery());

    act(() => {
      result.current.updateSearchTerm({ searchTerm: "math" });
    });

    expect(mockPush).toHaveBeenCalled();
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).toContain("term=math");
    expect(pushedUrl).toContain("keyStages=ks1");
  });

  test("updateSearchTerm resets pagination when the search term changes", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("term=science&page=3"),
    );

    const { result } = renderHook(() => useUpdateSearchQuery());

    act(() => {
      result.current.updateSearchTerm({ searchTerm: "math" });
    });

    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).not.toContain("page");
    expect(pushedUrl).toContain("term=math");
  });

  test("updateSearchFilters adds a search filter for a new key", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("term=math"),
    );

    const { result } = renderHook(() => useUpdateSearchQuery());

    act(() => {
      result.current.updateSearchFilters({
        filterSlug: "ks1",
        filterType: "keyStages",
      });
    });

    expect(mockPush).toHaveBeenCalled();
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).toContain("keyStages");
    expect(pushedUrl).toContain("ks1");
  });

  test("updateSearchFilters adds a new filter to an existing filter array", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("term=math&keyStages=ks1"),
    );

    const { result } = renderHook(() => useUpdateSearchQuery());

    act(() => {
      result.current.updateSearchFilters({
        filterSlug: "ks2",
        filterType: "keyStages",
      });
    });

    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).toContain("ks1");
    expect(pushedUrl).toContain("ks2");
  });

  test("updateSearchFilters removes a filter that is already selected", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("term=math&keyStages=ks1,ks2"),
    );

    const { result } = renderHook(() => useUpdateSearchQuery());

    act(() => {
      result.current.updateSearchFilters({
        filterSlug: "ks1",
        filterType: "keyStages",
      });
    });

    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).toContain("ks2");
    expect(pushedUrl).not.toContain("ks1");
  });

  test("updateSearchFilters resets pagination when the filters change", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("term=math&page=2"),
    );

    const { result } = renderHook(() => useUpdateSearchQuery());

    act(() => {
      result.current.updateSearchFilters({
        filterSlug: "ks1",
        filterType: "keyStages",
      });
    });

    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).not.toContain("page");
    expect(mockPush).toHaveBeenCalled();
  });
});
