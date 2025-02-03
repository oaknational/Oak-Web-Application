import { act, renderHook, waitFor } from "@testing-library/react";

import { useAdditionalFilesDownload } from "./useAdditionalFilesDownload";

import * as downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";

vi.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources",
);

window.alert = vi.fn();

describe(useAdditionalFilesDownload, () => {
  let downloadSpy: jest.SpyInstance;

  beforeEach(() => {
    downloadSpy = vi
      .spyOn(downloadLessonResources, "default")
      .mockResolvedValue();
  });

  afterEach(() => {
    downloadSpy.mockRestore();
  });

  it("downloads when startAdditionalFilesDownload is called", async () => {
    const { result } = renderHook(() =>
      useAdditionalFilesDownload("lesson-slug"),
    );

    await act(async () => {
      await result.current.startAdditionalFilesDownload();
    });

    expect(downloadSpy).toHaveBeenCalledWith(
      "lesson-slug",
      ["worksheet-pdf-questions"],
      false,
    );
  });

  it("reports on the loading state of the download", async () => {
    const { result } = renderHook(() =>
      useAdditionalFilesDownload("lesson-slug"),
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
      useAdditionalFilesDownload("lesson-slug"),
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
    const alertSpy = vi.spyOn(window, "alert");
    const { result } = renderHook(() =>
      useAdditionalFilesDownload("lesson-slug"),
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
