import { renderHook, waitFor } from "@testing-library/react";

import useLessonDownloadExistenceCheck from "./useLessonDownloadExistenceCheck";

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

const getDownloadResourcesExistenceMock = jest.fn(() => ({
  resources: getDownloadResourcesExistenceData,
}));

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
  () => ({
    __esModule: true,
    getLessonDownloadResourcesExistence: jest.fn((...args: []) =>
      getDownloadResourcesExistenceMock(...args),
    ),
  }),
);

describe("useLessonDownloadExistenceCheck", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it calls onComplete with correct argument when all resources are available", async () => {
    const lessonSlug = "sampleLesson";
    const resourcesToCheck: ResourcesToDownloadArrayType = [
      "exit-quiz-answers",
      "worksheet-pdf",
    ];
    const onComplete = jest.fn();
    const isLegacyDownload = true;

    renderHook(() =>
      useLessonDownloadExistenceCheck({
        lessonSlug,
        resourcesToCheck,
        additionalFilesIdsToCheck: null,
        onComplete,

        isLegacyDownload,
      }),
    );

    await waitFor(() => {
      expect(getDownloadResourcesExistenceMock).toBeCalledTimes(1);
      expect(getDownloadResourcesExistenceMock).toBeCalledWith({
        lessonSlug,
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
        isLegacyDownload: true,
        additionalFilesIdsString: undefined,
      });
    });

    expect(onComplete).toBeCalledTimes(1);
    expect(onComplete).toBeCalledWith(["exit-quiz-answers", "worksheet-pdf"]);
  });

  test("it calls onComplete with correct argument when resource is not available", async () => {
    const lessonSlug = "sampleLesson";
    const resourcesToCheck: ResourcesToDownloadArrayType = [
      "exit-quiz-answers",
      "worksheet-pdf",
    ];
    const onComplete = jest.fn();

    getDownloadResourcesExistenceMock.mockImplementationOnce(() => ({
      resources: [
        ["exit-quiz-answers", { exists: false }],
        ["worksheet-pdf", { exists: true }],
      ],
    }));
    const isLegacyDownload = true;

    renderHook(() =>
      useLessonDownloadExistenceCheck({
        lessonSlug,
        resourcesToCheck,
        additionalFilesIdsToCheck: null,
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
