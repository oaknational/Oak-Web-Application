import { renderHook, waitFor } from "@testing-library/react";

import useLessonDownload from "./useLessonDownload";

import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

const mockAuthGetToken = jest.fn().mockResolvedValue(null);
jest.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ getToken: mockAuthGetToken }),
}));
const mockPersistResourceFormDetails = jest.fn();
jest.mock("./usePersistResourceFormDetails", () => () => ({
  persistResourceFormDetails: mockPersistResourceFormDetails,
}));

describe("useLessonDownload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("downloads the selected lesson resources", async () => {
    const { result } = renderHook(() => useLessonDownload());

    const data: ResourceFormValues = {
      school: "homeschool",
      terms: true,
      resources: ["intro-quiz-questions"],
    };

    await result.current.onSubmit({
      data,
      slug: "lesson",
      isLegacyDownload: true,
    });

    await waitFor(() => {
      expect(mockPersistResourceFormDetails).toHaveBeenCalledWith(data);
      expect(downloadLessonResources).toHaveBeenCalledWith({
        lessonSlug: "lesson",
        selectedResourceTypes: ["intro-quiz-questions"],
        selectedAdditionalFilesIds: [],
        isLegacyDownload: true,
        authToken: null,
      });
    });
  });

  it("groups selected additional files and passes their asset IDs", async () => {
    const { result } = renderHook(() => useLessonDownload());

    await result.current.onSubmit({
      data: {
        school: "homeschool",
        terms: true,
        resources: [
          "intro-quiz-questions",
          "additional-files-123",
          "additional-files-345",
        ],
      },
      slug: "lesson",
      isLegacyDownload: true,
    });

    expect(downloadLessonResources).toHaveBeenCalledWith({
      lessonSlug: "lesson",
      selectedResourceTypes: ["intro-quiz-questions", "additional-files"],
      selectedAdditionalFilesIds: [123, 345],
      isLegacyDownload: true,
      authToken: null,
    });
  });
});
