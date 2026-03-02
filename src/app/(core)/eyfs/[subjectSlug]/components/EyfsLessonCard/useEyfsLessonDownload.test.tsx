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

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit",
  () => ({
    useHubspotSubmit: () => ({
      onHubspotSubmit: () => {
        return Promise.resolve(true);
      },
    }),
  }),
);

jest.mock(
  "@/components/TeacherComponents/helpers/downloadAndShareHelpers/fetchHubspotContactDetails",
  () => ({
    fetchHubspotContactDetails: async () => {
      return {
        schoolId: "SCHOOL_ID",
        schoolName: "SCHOOL_NAME",
        email: "EMAIL",
      };
    },
  }),
);

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads",
  () => ({
    __esModule: true,
    default: () => ({
      setEmailInLocalStorage: jest.fn(),
      setSchoolInLocalStorage: jest.fn(),
      setTermsInLocalStorage: jest.fn(),
      schoolFromLocalStorage: {
        schoolName: "test-school-local",
        schoolId: "1-local",
      },
      emailFromLocalStorage: "test-email-local",
      termsFromLocalStorage: true,
    }),
  }),
);

const mockToast = jest.fn();
jest.mock("@/context/OakNotifications/useOakNotificationsContext", () => ({
  __esModule: true,
  useOakNotificationsContext: () => ({
    setCurrentToastProps: (args: OakToastProps | null) => mockToast(args),
  }),
}));

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit",
  () => ({
    __esModule: true,
    useHubspotSubmit: () => ({ onHubspotSubmit: jest.fn() }),
  }),
);

const mockProps = {
  lessonSlug: "lesson-123",
  downloadableResources: [
    "exit-quiz-answers",
    "worksheet-pdf",
  ] as ResourcesToDownloadArrayType,
};

describe("useEyfsLessonDownload", () => {
  it("onDownload triggers a success toast on successful download", async () => {
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
  it("onDownload triggers an error toast when download fails", async () => {
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
  it("onDownload reports an error", async () => {
    mockDownloadResponse.mockImplementationOnce(() => Promise.reject());

    const { result } = renderHookWithProviders()(() =>
      useEyfsLessonDownload(mockProps),
    );

    result.current.onDownload();

    await waitFor(() => expect(mockErrorReporter).toHaveBeenCalled());
  });
});
