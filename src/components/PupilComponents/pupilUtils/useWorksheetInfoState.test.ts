import { renderHook, waitFor } from "@testing-library/react";

import { useWorksheetInfoState } from "./useWorksheetInfoState";

const mockGetWorksheetInfo = jest.fn().mockResolvedValue([]);
jest.mock("./getWorksheetInfo", () => ({
  getWorksheetInfo: () => mockGetWorksheetInfo(),
}));

describe("useWorksheetInfoState", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("calls getWorksheetInfo when worksheet asset object exists", async () => {
    const res = renderHook(() => useWorksheetInfoState(true, "slug"));
    await waitFor(() => {
      expect(res.result.current.worksheetInfo).toEqual([]);
    });
    expect(mockGetWorksheetInfo).toHaveBeenCalledTimes(1);
  });
  it("does not call getWorksheetInfo when worksheet asset object does not exist", async () => {
    const res = renderHook(() => useWorksheetInfoState(false, "slug"));
    expect(res.result.current.worksheetInfo).toEqual(null);
    expect(mockGetWorksheetInfo).not.toHaveBeenCalled();
  });
  it("returns worksheet info", async () => {
    const mockInfo = [
      { item: "worksheet", exists: true, fileSize: "1MB", ext: "pdf" },
    ];
    mockGetWorksheetInfo.mockResolvedValue(mockInfo);
    const res = renderHook(() => useWorksheetInfoState(true, "slug"));
    await waitFor(() => {
      expect(res.result.current.worksheetInfo).toEqual(mockInfo);
    });
    expect(mockGetWorksheetInfo).toHaveBeenCalledTimes(1);
  });
});
