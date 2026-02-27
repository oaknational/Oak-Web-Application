import { waitFor } from "@testing-library/react";
import { OakToastProps } from "@oaknational/oak-components";

import { useEyfsLessonDownload } from "./useEyfsLessonDownload";

import { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
  () => ({
    __esModule: true,
    getLessonDownloadResourcesExistence: jest.fn(() => ({
      resources: [
        ["exit-quiz-answers", { exists: true }],
        ["worksheet-pdf", { exists: true }],
      ],
    })),
  }),
);

const mockDownloadResponse = jest.fn().mockResolvedValue(Promise.resolve());
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources",
  () => ({
    __esModule: true,
    default: () => mockDownloadResponse(),
  }),
);

const mockToast = jest.fn();
jest.mock("@/context/OakNotifications/useOakNotificationsContext", () => ({
  __esModule: true,
  useOakNotificationsContext: () => ({
    setCurrentToastProps: (args: OakToastProps | null) => mockToast(args),
  }),
}));

const mockProps = {
  lessonSlug: "lesson-123",
  downloadableResources: [
    "exit-quiz-answers",
    "worksheet-pdf",
  ] as ResourcesToDownloadArrayType,
};

describe("useEyfsLessonDownload", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("onDownload a success toast on successful download", async () => {
    const { result } = renderHookWithProviders()(() =>
      useEyfsLessonDownload(mockProps),
    );

    result.current.onDownload();

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        message: "Download successful",
        variant: "success",
        showIcon: true,
        autoDismiss: true,
      }),
    );
  });
  it("onDownload an error toast when download fails", async () => {
    mockDownloadResponse.mockImplementationOnce(() => Promise.reject());

    const { result } = renderHookWithProviders()(() =>
      useEyfsLessonDownload(mockProps),
    );

    result.current.onDownload();

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        message:
          "Something went wrong with the download. Try refreshing the page.",
        variant: "error",
        showIcon: true,
        autoDismiss: true,
      }),
    );
  });
});
