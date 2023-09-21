import { renderHook, waitFor } from "@testing-library/react";

import type {
  DownloadResourceType,
  ResourcesToDownloadArrayType,
} from "../downloads.types";

import useDownloadExistenceCheck from "./useDownloadExistenceCheck";

const resources: Partial<Record<DownloadResourceType, boolean>> = {
  "exit-quiz-answers": true,
  "worksheet-pdf": true,
};

const getDownloadResourcesExistenceData = {
  resources,
};

const getDownloadResourcesExistenceMock = jest.fn(
  () => getDownloadResourcesExistenceData,
);

jest.mock("../helpers/getDownloadResourcesExistence", () => ({
  __esModule: true,
  default: (...args: []) => getDownloadResourcesExistenceMock(...args),
}));

describe("useDownloadExistenceCheck", () => {
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

  test("it calls onComplete with correct argument when resource is not available", async () => {
    const lessonSlug = "sampleLesson";
    const resourcesToCheck: ResourcesToDownloadArrayType = [
      "exit-quiz-answers",
      "worksheet-pdf",
    ];
    const onComplete = jest.fn();

    getDownloadResourcesExistenceMock.mockImplementationOnce(() => ({
      resources: {
        "exit-quiz-answers": false,
        "worksheet-pdf": true,
      },
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
