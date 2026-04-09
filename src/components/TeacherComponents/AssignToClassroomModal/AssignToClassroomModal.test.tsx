import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  AssignToClassroomModal,
  ScopeInsufficientError,
} from "./AssignToClassroomModal";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    verifySession: jest.fn(),
    listCourses: jest.fn(),
    createCourseWork: jest.fn(),
    getGoogleSignInUrl: jest.fn(),
  },
}));

const mockVerifySession = googleClassroomApi.verifySession as jest.Mock;
const mockListCourses = googleClassroomApi.listCourses as jest.Mock;
const mockCreateCourseWork = googleClassroomApi.createCourseWork as jest.Mock;
const mockGetGoogleSignInUrl =
  googleClassroomApi.getGoogleSignInUrl as jest.Mock;

const mockWindowOpen = jest.fn().mockReturnValue({ close: jest.fn() });
const mockCookieStore = { set: jest.fn() };

Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});
Object.defineProperty(window, "cookieStore", {
  value: mockCookieStore,
  writable: true,
});

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  lessonSlug: "intro-algebra",
  programmeSlug: "maths-primary",
  unitSlug: "algebra-unit",
  lessonTitle: "Introduction to Algebra",
  exitQuizNumQuestions: 5,
};

const mockCourses = [
  { id: "course-1", name: "Maths Year 7", section: "Period 1" },
  { id: "course-2", name: "Maths Year 8" },
];

const authenticatedSession = () =>
  jest.fn().mockResolvedValue({ authenticated: true });
const unauthenticatedSession = () =>
  jest.fn().mockResolvedValue({ authenticated: false });

describe("AssignToClassroomModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifySession.mockReturnValue(unauthenticatedSession());
    mockListCourses.mockResolvedValue([]);
    mockCreateCourseWork.mockResolvedValue({
      courseId: "course-1",
      title: "Introduction to Algebra",
      assignmentToken: "token-abc",
    });
    mockGetGoogleSignInUrl.mockResolvedValue(
      "https://accounts.google.com/signin",
    );
  });

  describe("loading state", () => {
    it("shows a spinner while verifying session", () => {
      mockVerifySession.mockReturnValue(() => new Promise(() => {}));
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });
  });

  describe("unauthenticated state", () => {
    it("shows sign-in heading and description after unauthenticated session", async () => {
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);
      await waitFor(() => {
        expect(
          screen.getByText("Save to Google Classroom"),
        ).toBeInTheDocument();
      });
      expect(
        screen.getByText(
          /Sign in with Google to save this assignment as a draft/,
        ),
      ).toBeInTheDocument();
    });

    it("shows the Sign in with Google button", async () => {
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Sign in with Google" }),
        ).toBeInTheDocument();
      });
    });

    it("opens a popup and disables the button when sign-in is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Sign in with Google" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Sign in with Google" }),
      );

      expect(mockGetGoogleSignInUrl).toHaveBeenCalledWith(null);
      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith(
          "https://accounts.google.com/signin",
          "googleSignIn",
          expect.any(String),
        );
      });
    });

    it("does not open a popup when getGoogleSignInUrl returns null", async () => {
      mockGetGoogleSignInUrl.mockResolvedValue(null);
      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Sign in with Google" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Sign in with Google" }),
      );

      await waitFor(() => {
        expect(mockWindowOpen).not.toHaveBeenCalled();
      });
    });
  });

  describe("postMessage auth handler", () => {
    it("reloads courses after a successful auth message", async () => {
      mockVerifySession
        .mockReturnValueOnce(unauthenticatedSession())
        .mockReturnValue(authenticatedSession());
      mockListCourses.mockResolvedValue(mockCourses);

      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);
      await waitFor(() => {
        expect(
          screen.getByText("Save to Google Classroom"),
        ).toBeInTheDocument();
      });

      act(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              type: "oak-google-classroom-auth-complete",
              success: true,
              session: "new-session",
              accessToken: "new-token",
            },
          }),
        );
      });

      await waitFor(() => {
        expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
        expect(mockCookieStore.set).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "oak-gclassroom-session",
            value: "new-session",
          }),
        );
        expect(mockCookieStore.set).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "oak-gclassroom-token",
            value: "new-token",
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Maths Year 7 — Period 1")).toBeInTheDocument();
      });
    });

    it("ignores auth messages without success flag", async () => {
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);
      await waitFor(() => {
        expect(
          screen.getByText("Save to Google Classroom"),
        ).toBeInTheDocument();
      });

      const callCountBefore = (mockVerifySession as jest.Mock).mock.calls
        .length;

      act(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              type: "oak-google-classroom-auth-complete",
              success: false,
            },
          }),
        );
      });

      expect((mockVerifySession as jest.Mock).mock.calls.length).toBe(
        callCountBefore,
      );
    });

    it("ignores messages with a different type", async () => {
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);
      await waitFor(() => {
        expect(
          screen.getByText("Save to Google Classroom"),
        ).toBeInTheDocument();
      });

      const callCountBefore = (mockVerifySession as jest.Mock).mock.calls
        .length;

      act(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: { type: "some-other-event", success: true },
          }),
        );
      });

      expect((mockVerifySession as jest.Mock).mock.calls.length).toBe(
        callCountBefore,
      );
    });
  });

  describe("scope_insufficient state", () => {
    it("shows reconnect heading when listCourses throws ScopeInsufficientError", async () => {
      mockVerifySession.mockReturnValue(authenticatedSession());
      mockListCourses.mockRejectedValue(new ScopeInsufficientError());

      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Reconnect Google account" }),
        ).toBeInTheDocument();
      });
    });

    it("shows reconnect button in scope_insufficient state", async () => {
      mockVerifySession.mockReturnValue(authenticatedSession());
      mockListCourses.mockRejectedValue(new ScopeInsufficientError());

      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Reconnect Google account" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("course_picker state", () => {
    beforeEach(() => {
      mockVerifySession.mockReturnValue(authenticatedSession());
      mockListCourses.mockResolvedValue(mockCourses);
    });

    it("renders courses as radio buttons", async () => {
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Maths Year 7 — Period 1")).toBeInTheDocument();
        expect(screen.getByText("Maths Year 8")).toBeInTheDocument();
      });
    });

    it("shows assignment title input pre-filled with lessonTitle", async () => {
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        const input = screen.getByRole("textbox", {
          name: "Assignment title",
        }) as HTMLInputElement;
        expect(input.value).toBe("Introduction to Algebra");
      });
    });

    it("shows 'No active classes found' when courses array is empty", async () => {
      mockListCourses.mockResolvedValue([]);
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByText("No active classes found in your Google Classroom."),
        ).toBeInTheDocument();
      });
    });

    it("calls createCourseWork with correct args when Share assignment is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Share assignment" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Share assignment" }),
      );

      await waitFor(() => {
        expect(mockCreateCourseWork).toHaveBeenCalledWith({
          courseId: "course-1",
          title: "Introduction to Algebra",
          lessonSlug: "intro-algebra",
          programmeSlug: "maths-primary",
          unitSlug: "algebra-unit",
          maxPoints: 5,
        });
      });
    });

    it("uses maxPoints of 10 when exitQuizNumQuestions is not provided", async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <AssignToClassroomModal
          {...defaultProps}
          exitQuizNumQuestions={undefined}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Share assignment" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Share assignment" }),
      );

      await waitFor(() => {
        expect(mockCreateCourseWork).toHaveBeenCalledWith(
          expect.objectContaining({ maxPoints: 10 }),
        );
      });
    });

    it("calls onClose when Cancel is clicked", async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();
      renderWithTheme(
        <AssignToClassroomModal {...defaultProps} onClose={onClose} />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Cancel" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("success state", () => {
    beforeEach(() => {
      mockVerifySession.mockReturnValue(authenticatedSession());
      mockListCourses.mockResolvedValue(mockCourses);
    });

    it("shows 'Assignment saved' heading after successful createCourseWork", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Share assignment" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Share assignment" }),
      );

      await waitFor(() => {
        expect(screen.getByText("Assignment saved")).toBeInTheDocument();
      });
    });

    it("shows a link to Google Classroom", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Share assignment" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Share assignment" }),
      );

      await waitFor(() => {
        const link = screen.getByRole("link", { name: "View draft" });
        expect(link).toHaveAttribute("href", "https://classroom.google.com");
      });
    });

    it("calls onClose when Close is clicked in success state", async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();
      renderWithTheme(
        <AssignToClassroomModal {...defaultProps} onClose={onClose} />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Share assignment" }),
        ).toBeInTheDocument();
      });
      await user.click(
        screen.getByRole("button", { name: "Share assignment" }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Close" }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("error state", () => {
    beforeEach(() => {
      mockVerifySession.mockReturnValue(authenticatedSession());
      mockListCourses.mockResolvedValue(mockCourses);
    });

    it("shows error heading when createCourseWork throws", async () => {
      mockCreateCourseWork.mockRejectedValue(new Error("Network failure"));
      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Share assignment" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Share assignment" }),
      );

      await waitFor(() => {
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByText("Network failure")).toBeInTheDocument();
      });
    });

    it("shows scope_insufficient state when createCourseWork throws ScopeInsufficientError", async () => {
      mockCreateCourseWork.mockRejectedValue(new ScopeInsufficientError());
      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Share assignment" }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: "Share assignment" }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Reconnect Google account" }),
        ).toBeInTheDocument();
      });
    });

    it("shows error when listCourses throws a generic error", async () => {
      mockListCourses.mockRejectedValue(new Error("Classroom unavailable"));

      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByText("Classroom unavailable")).toBeInTheDocument();
      });
    });

    it("retries loading when Try again is clicked", async () => {
      mockListCourses
        .mockRejectedValueOnce(new Error("Classroom unavailable"))
        .mockResolvedValue(mockCourses);

      const user = userEvent.setup();
      renderWithTheme(<AssignToClassroomModal {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Try again" }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Try again" }));

      await waitFor(() => {
        expect(screen.getByText("Maths Year 7 — Period 1")).toBeInTheDocument();
      });
    });
  });

  describe("isOpen behaviour", () => {
    it("resets to loading state when isOpen changes from true to false", async () => {
      mockVerifySession.mockReturnValue(authenticatedSession());
      mockListCourses.mockResolvedValue(mockCourses);

      const { rerender } = renderWithTheme(
        <AssignToClassroomModal {...defaultProps} isOpen={true} />,
      );

      await waitFor(() => {
        expect(screen.getByText("Maths Year 7 — Period 1")).toBeInTheDocument();
      });

      // Re-open: should re-verify session
      const callsBefore = mockVerifySession.mock.calls.length;
      rerender(<AssignToClassroomModal {...defaultProps} isOpen={false} />);

      rerender(<AssignToClassroomModal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        expect(mockVerifySession.mock.calls.length).toBeGreaterThan(
          callsBefore,
        );
      });
    });
  });
});
