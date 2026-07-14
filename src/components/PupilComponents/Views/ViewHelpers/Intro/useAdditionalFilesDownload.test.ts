import { act, renderHook, waitFor } from "@testing-library/react";

import { useAdditionalFilesDownload } from "./useAdditionalFilesDownload";

import * as downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources",
);

window.alert = jest.fn();

describe(useAdditionalFilesDownload, () => {
  let downloadSpy: jest.SpyInstance;

  beforeEach(() => {
    downloadSpy = jest
      .spyOn(downloadLessonResources, "default")
      .mockResolvedValue();
  });

  afterEach(() => {
    downloadSpy.mockRestore();
  });

  it("downloads when startAdditionalFilesDownload is called", async () => {
    const { result } = renderHook(() =>
      useAdditionalFilesDownload("lesson-slug", [123, 345]),
    );

    await act(async () => {
      await result.current.startAdditionalFilesDownload();
    });

    expect(downloadSpy).toHaveBeenCalledWith({
      lessonSlug: "lesson-slug",
      selectedResourceTypes: ["additional-files"],
      selectedAdditionalFilesIds: [123, 345],
      isLegacyDownload: false,
    });
  });

  it("reports on the loading state of the download", async () => {
    const { result } = renderHook(() =>
      useAdditionalFilesDownload("lesson-slug", [123, 345]),
    );

    expect(result.current.isAdditionalFilesDownloading).toBe(false);

    act(() => {
      result.current.startAdditionalFilesDownload();
    });

    expect(result.current.isAdditionalFilesDownloading).toBe(true);

    await waitFor(async () => {
      expect(result.current.isAdditionalFilesDownloading).toBe(false);
    });
  });

  it("does not allow another download to start while one is in progress", async () => {
    const { result } = renderHook(() =>
      useAdditionalFilesDownload("lesson-slug", [123, 345]),
    );

    act(() => {
      result.current.startAdditionalFilesDownload();
    });
    act(() => {
      result.current.startAdditionalFilesDownload();
    });

    await waitFor(async () => {
      expect(result.current.isAdditionalFilesDownloading).toBe(false);
    });

    expect(downloadLessonResources.default).toHaveBeenCalledTimes(1);
  });

  it("handles failed downloads", async () => {
    downloadSpy.mockRejectedValue(new Error("whoops"));
    const alertSpy = jest.spyOn(window, "alert");
    const { result } = renderHook(() =>
      useAdditionalFilesDownload("lesson-slug", [123, 345]),
    );

    act(() => {
      result.current.startAdditionalFilesDownload();
    });

    await waitFor(async () => {
      expect(result.current.isAdditionalFilesDownloading).toBe(false);
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Whoops, the download failed. You could try again.",
    );
  });
});
