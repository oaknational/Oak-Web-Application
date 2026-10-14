/**
 * @jest-environment node
 */
import { getUnitDownloadExistence } from "./getCachedUnitData";

const mockGetUnitDownloadFileExistence = jest.fn();
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
  () => ({
    getUnitDownloadFileExistence: (...args: unknown[]) =>
      mockGetUnitDownloadFileExistence(...args),
  }),
);

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  initialiseBugsnag: jest.fn(),
  initialiseSentry: jest.fn(),
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

describe("getUnitDownloadExistence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the existence check result when the check succeeds", async () => {
    mockGetUnitDownloadFileExistence.mockResolvedValue({
      exists: true,
      fileSize: "1.2MB",
    });

    const result = await getUnitDownloadExistence("cells-123");

    expect(mockGetUnitDownloadFileExistence).toHaveBeenCalledWith("cells-123");
    expect(result).toEqual({
      exists: true,
      fileSize: "1.2MB",
      checkFailed: false,
    });
  });

  it("reports the error and degrades when the check fails", async () => {
    const error = new Error("check-files unavailable");
    mockGetUnitDownloadFileExistence.mockRejectedValue(error);

    const result = await getUnitDownloadExistence("cells-456");

    expect(mockGetUnitDownloadFileExistence).toHaveBeenCalledTimes(1);
    expect(mockErrorReporter).toHaveBeenCalledWith(error, {
      unitFileId: "cells-456",
    });
    expect(result).toEqual({ checkFailed: true, exists: undefined });
  });
});
