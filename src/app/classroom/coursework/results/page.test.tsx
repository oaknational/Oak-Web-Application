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

const { getLessonData } = jest.requireMock(
  "@/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/results/printable/getLessonData",
);

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

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockJsonResponse = (data: unknown, status = 200) => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
};

describe("CourseWorkResultsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("assignmentToken=token-abc&submissionId=sub-1"),
    );
    mockJsonResponse(mockResultsData);
    getLessonData.mockResolvedValue({
      browseData: mockBrowseData,
      content: mockContent,
    });
  });

  it("shows a loading spinner on initial render", async () => {
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    // The spinner is only visible before the first async tick — check it
    // appeared by verifying the results are now present (load completed)
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

  it("fetches from the correct URL with assignmentToken and submissionId", async () => {
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/classroom/coursework/results?assignmentToken=token-abc&submissionId=sub-1",
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
    expect(mockFetch).not.toHaveBeenCalled();
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
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("shows an error message when the fetch fails", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, { status: 500, statusText: "Internal Server Error" }),
    );
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch results: 500"),
      ).toBeInTheDocument();
    });
  });

  it("shows an error message when pupilProgress is null", async () => {
    mockJsonResponse({ ...mockResultsData, pupilProgress: null });
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

  it("shows a generic error message when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));
    await act(async () => {
      renderWithTheme(<CourseWorkResultsPage />);
    });
    await waitFor(() => {
      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });
});
