import React from "react";
import { screen, waitFor, act } from "@testing-library/react";

import CourseWorkResultsPage from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";

const useSearchParamsMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock(
  "@/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/results/printable/getLessonData",
  () => ({
    getLessonData: jest.fn(),
  }),
);

jest.mock("@/components/PupilViews/PupilResults/PupilResults.view", () => ({
  PupilViewsResults: () => <div data-testid="pupil-results">Results</div>,
}));

jest.mock("@/browser-lib/mathjax/MathJaxProvider", () => ({
  MathJaxProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    getCourseWorkResults: jest.fn(),
  },
}));

const { getLessonData } = jest.requireMock(
  "@/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/results/printable/getLessonData",
);

 
const mockGetCourseWorkResults = jest.requireMock(
  "@/browser-lib/google-classroom/googleClassroomApi",
).default.getCourseWorkResults as jest.Mock;

const mockBrowseData = lessonBrowseDataFixture({});
const mockContent = lessonContentFixture({});

const mockPupilProgress = {
  submissionId: "sub-1",
  assignmentToken: "token-abc",
  courseWorkId: "cw-1",
  courseId: "course-1",
  createdAt: "2024-01-01",
  exitQuiz: {
    grade: 8,
    numQuestions: 10,
    isComplete: true,
    questionResults: [],
  },
};

const mockResultsData = {
  lessonSlug: "intro-algebra",
  programmeSlug: "maths-primary",
  unitSlug: "algebra-unit",
  pupilProgress: mockPupilProgress,
};

describe("CourseWorkResultsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("assignmentToken=token-abc&submissionId=sub-1"),
    );
    mockGetCourseWorkResults.mockResolvedValue(mockResultsData);
    getLessonData.mockResolvedValue({
      browseData: mockBrowseData,
      content: mockContent,
    });
  });

  it("shows a loading spinner on initial render", async () => {
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("pupil-results")).toBeInTheDocument();
    });
  });

  it("renders PupilViewsResults after data loads", async () => {
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("pupil-results")).toBeInTheDocument();
    });
  });

  it("calls getCourseWorkResults with assignmentToken and submissionId", async () => {
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(mockGetCourseWorkResults).toHaveBeenCalledWith(
        "token-abc",
        "sub-1",
      );
    });
  });

  it("calls getLessonData with the lessonSlug from the API response", async () => {
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(getLessonData).toHaveBeenCalledWith("intro-algebra");
    });
  });

  it("shows an error message when assignmentToken is missing", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("submissionId=sub-1"),
    );
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(
        screen.getByText("Missing assignmentToken or submissionId"),
      ).toBeInTheDocument();
    });
    expect(mockGetCourseWorkResults).not.toHaveBeenCalled();
  });

  it("shows an error message when submissionId is missing", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("assignmentToken=token-abc"),
    );
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(
        screen.getByText("Missing assignmentToken or submissionId"),
      ).toBeInTheDocument();
    });
    expect(mockGetCourseWorkResults).not.toHaveBeenCalled();
  });

  it("shows an error message when the API returns null", async () => {
    mockGetCourseWorkResults.mockResolvedValueOnce(null);
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(screen.getByText("Failed to fetch results")).toBeInTheDocument();
    });
  });

  it("shows an error message when pupilProgress is null", async () => {
    mockGetCourseWorkResults.mockResolvedValueOnce({
      ...mockResultsData,
      pupilProgress: null,
    });
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(
        screen.getByText("No results found for this submission"),
      ).toBeInTheDocument();
    });
  });

  it("shows an error message when getLessonData returns null", async () => {
    getLessonData.mockResolvedValueOnce(null);
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(screen.getByText("Lesson data not found")).toBeInTheDocument();
    });
  });

  it("shows a generic error message when getCourseWorkResults throws", async () => {
    mockGetCourseWorkResults.mockRejectedValueOnce(
      new Error("Network failure"),
    );
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });
});
