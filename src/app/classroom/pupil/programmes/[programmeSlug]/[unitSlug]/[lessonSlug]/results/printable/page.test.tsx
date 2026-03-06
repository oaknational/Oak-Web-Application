import React from "react";
import { screen, waitFor } from "@testing-library/react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { googleClassroomApi } from "@/browser-lib/google-classroom";
import { PupilLessonProgressMapper } from "@/browser-lib/google-classroom/PupilLessonProgressMapper";

const useSearchParamsMock = jest.fn();
const useParamsMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => useSearchParamsMock(),
  useParams: () => useParamsMock(),
}));

jest.mock("./getLessonData", () => ({
  getLessonData: jest.fn(),
}));

jest.mock("@/browser-lib/google-classroom", () => ({
  googleClassroomApi: {
    getPupilLessonProgress: jest.fn(),
  },
}));

jest.mock("@/browser-lib/google-classroom/PupilLessonProgressMapper", () => ({
  PupilLessonProgressMapper: {
    toLessonAttemptData: jest.fn(),
  },
}));

jest.mock("@/components/PupilViews/PupilResults", () => ({
  PupilViewsResults: () => <div data-testid="pupil-results">Results</div>,
}));

jest.mock("@/browser-lib/mathjax/MathJaxProvider", () => ({
  MathJaxProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const { getLessonData } = jest.requireMock("./getLessonData");
const mockGetPupilLessonProgress =
  googleClassroomApi.getPupilLessonProgress as jest.Mock;
const mockToLessonAttemptData =
  PupilLessonProgressMapper.toLessonAttemptData as jest.Mock;

const mockBrowseData = lessonBrowseDataFixture({});
const mockContent = lessonContentFixture({});
const mockPupilProgress = {
  submissionId: "sub-1",
  attachmentId: "att-1",
  itemId: "item-1",
  createdAt: "2024-01-01",
};
const mockAttemptData = { attemptId: "sub-1:att-1:item-1" };

describe("src/app/classroom/pupil/.../results/printable/page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParamsMock.mockReturnValue({ lessonSlug: "lesson-1" });
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "submissionId=sub-1&courseId=course-1&itemId=item-1&attachmentId=att-1",
      ),
    );
    getLessonData.mockResolvedValue({
      browseData: mockBrowseData,
      content: mockContent,
    });
    mockGetPupilLessonProgress.mockResolvedValue(mockPupilProgress);
    mockToLessonAttemptData.mockReturnValue(mockAttemptData);
  });

  it("shows a loading spinner on initial render", () => {
    renderWithTheme(<Page />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.queryByTestId("pupil-results")).not.toBeInTheDocument();
  });

  it("renders PupilViewsResults after data loads", async () => {
    renderWithTheme(<Page />);
    await waitFor(() => {
      expect(screen.getByTestId("pupil-results")).toBeInTheDocument();
    });
  });

  it("calls getLessonData with the lessonSlug from params", async () => {
    renderWithTheme(<Page />);
    await waitFor(() => {
      expect(getLessonData).toHaveBeenCalledWith("lesson-1");
    });
  });

  it("calls getPupilLessonProgress with search params", async () => {
    renderWithTheme(<Page />);
    await waitFor(() => {
      expect(mockGetPupilLessonProgress).toHaveBeenCalledWith({
        submissionId: "sub-1",
        itemId: "item-1",
        attachmentId: "att-1",
      });
    });
  });

  it("calls PupilLessonProgressMapper.toLessonAttemptData with lesson metadata", async () => {
    renderWithTheme(<Page />);
    await waitFor(() => {
      expect(mockToLessonAttemptData).toHaveBeenCalledWith(
        expect.objectContaining({
          pupilProgress: mockPupilProgress,
          lessonSlug: "lesson-1",
        }),
      );
    });
  });

  it("shows spinner when required query params are missing", async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
    renderWithTheme(<Page />);
    await waitFor(() => {
      expect(getLessonData).toHaveBeenCalled();
    });
    expect(screen.queryByTestId("pupil-results")).not.toBeInTheDocument();
  });

  it("shows spinner when getPupilLessonProgress returns null", async () => {
    mockGetPupilLessonProgress.mockResolvedValue(null);
    renderWithTheme(<Page />);
    await waitFor(() => {
      expect(getLessonData).toHaveBeenCalled();
    });
    expect(screen.queryByTestId("pupil-results")).not.toBeInTheDocument();
  });
});
