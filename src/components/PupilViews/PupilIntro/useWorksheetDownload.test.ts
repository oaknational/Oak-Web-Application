import { act, renderHook, waitFor } from "@testing-library/react";

import { useWorksheetDownload } from "./useWorksheetDownload";

import * as downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources",
);

window.alert = jest.fn();

describe(useWorksheetDownload, () => {
  let downloadSpy: jest.SpyInstance;

  beforeEach(() => {
    downloadSpy = jest
      .spyOn(downloadLessonResources, "default")
      .mockResolvedValue();
  });

  afterEach(() => {
    downloadSpy.mockRestore();
  });

  it("downloads when startDownload is called", async () => {
    const { result } = renderHook(() =>
      useWorksheetDownload("lesson-slug", false),
    );

    await act(async () => {
      await result.current.startDownload();
    });

    expect(downloadSpy).toHaveBeenCalledWith({
      lessonSlug: "lesson-slug",
      selectedResourceTypes: ["worksheet-pdf-questions"],
      isLegacyDownload: false,
    });
  });

  it("reports on the loading state of the download", async () => {
    const { result } = renderHook(() =>
      useWorksheetDownload("lesson-slug", false),
    );

    expect(result.current.isDownloading).toBe(false);

    act(() => {
      result.current.startDownload();
    });

    expect(result.current.isDownloading).toBe(true);

    await waitFor(async () => {
      expect(result.current.isDownloading).toBe(false);
    });
  });

  it("does not allow another download to start while one is in progress", async () => {
    const { result } = renderHook(() =>
      useWorksheetDownload("lesson-slug", false),
    );

    act(() => {
      result.current.startDownload();
    });
    act(() => {
      result.current.startDownload();
    });

    await waitFor(async () => {
      expect(result.current.isDownloading).toBe(false);
    });

    expect(downloadLessonResources.default).toHaveBeenCalledTimes(1);
  });

  it("handles failed downloads", async () => {
    downloadSpy.mockRejectedValue(new Error("whoops"));
    const alertSpy = jest.spyOn(window, "alert");
    const { result } = renderHook(() =>
      useWorksheetDownload("lesson-slug", false),
    );

    act(() => {
      result.current.startDownload();
    });

    await waitFor(async () => {
      expect(result.current.isDownloading).toBe(false);
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Whoops, the download failed. You could try again.",
    );
  });
});
