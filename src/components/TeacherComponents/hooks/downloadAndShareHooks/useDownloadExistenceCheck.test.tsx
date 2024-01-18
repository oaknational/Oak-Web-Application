import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import useDownloadExistenceCheck from "./useDownloadExistenceCheck";

import type {
  DownloadResourceType,
  ResourcesToDownloadArrayType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";

const resources: Partial<Record<DownloadResourceType, boolean>> = {
  "exit-quiz-answers": true,
  "worksheet-pdf": true,
};

const getDownloadResourcesExistenceData = Object.entries(resources).map((v) => [
  v[0],
  { exists: v[1] },
]);

const getDownloadResourcesExistenceMock = vi.fn(() => ({
  resources: getDownloadResourcesExistenceData,
}));

vi.mock(
  "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
  () => ({
    __esModule: true,
    default: (...args: []) => getDownloadResourcesExistenceMock(...args),
  }),
);

describe("useDownloadExistenceCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("it calls onComplete with correct argument when all resources are available", async () => {
    const lessonSlug = "sampleLesson";
    const resourcesToCheck: ResourcesToDownloadArrayType = [
      "exit-quiz-answers",
      "worksheet-pdf",
    ];
    const onComplete = vi.fn();
    const isLegacyDownload = true;

    renderHook(() =>
      useDownloadExistenceCheck({
        lessonSlug,
        resourcesToCheck,
        onComplete,

        isLegacyDownload,
      }),
    );

    await waitFor(() => {
      expect(getDownloadResourcesExistenceMock).toBeCalledTimes(1);
      expect(getDownloadResourcesExistenceMock).toBeCalledWith(
        lessonSlug,
        "exit-quiz-answers,worksheet-pdf",
        true,
      );
    });

    expect(onComplete).toBeCalledTimes(1);
    expect(onComplete).toBeCalledWith(["exit-quiz-answers", "worksheet-pdf"]);
  });

  it("it calls onComplete with correct argument when resource is not available", async () => {
    const lessonSlug = "sampleLesson";
    const resourcesToCheck: ResourcesToDownloadArrayType = [
      "exit-quiz-answers",
      "worksheet-pdf",
    ];
    const onComplete = vi.fn();

    getDownloadResourcesExistenceMock.mockImplementationOnce(() => ({
      resources: [
        ["exit-quiz-answers", { exists: false }],
        ["worksheet-pdf", { exists: true }],
      ],
    }));
    const isLegacyDownload = true;

    renderHook(() =>
      useDownloadExistenceCheck({
        lessonSlug,
        resourcesToCheck,
        onComplete,
        isLegacyDownload,
      }),
    );

    await waitFor(() => {
      expect(onComplete).toBeCalledWith(["worksheet-pdf"]);
    });
  });

  test.todo("it calls Bugsnug if there is an error");
});
