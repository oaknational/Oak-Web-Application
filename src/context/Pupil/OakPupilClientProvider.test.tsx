import { ReactNode } from "react";
import { render, renderHook, act, waitFor } from "@testing-library/react";
import { mockGetAttempt } from "@/node-lib/pupil-api/__mocks__/MockPupilClient";

// IMPORTANT: mock BEFORE importing the module you mock
jest.mock("@/node-lib/pupil-api/client/client", () => {
  const mockClientState = { test: "state" };

  // Single instance object so we can access stored callback
  const instance = {
    init: jest.fn(),
    getState: jest.fn(() => mockClientState),
    logAttempt: jest.fn(),
    getAttempt: jest.fn(mockGetAttempt),
    onStateChange: jest.fn((cb: (s: unknown) => void) => {
      instance._onStateChange = cb;
      return jest.fn(); // unsubscribe mock
    }),
    _onStateChange: undefined as undefined | ((s: unknown) => void),
  };

  return {
    OakPupilClient: jest.fn().mockImplementation(() => instance),
    __mockClientState: mockClientState,
    __mockClientInstance: instance,
  };
});

import { OakPupilClient } from "@/node-lib/pupil-api/client/client";
import { OakPupilClientProvider } from "./OakPupilClientProvider";
import { useOakPupil } from "@/hooks/useOakPupil";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <OakPupilClientProvider>{children}</OakPupilClientProvider>
);

describe("OakPupilClientProvider + useOakPupil", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initialises the client on mount", () => {
    render(
      <Wrapper>
        <div>Hello</div>
      </Wrapper>,
    );
    expect(OakPupilClient).toHaveBeenCalledTimes(1);
    const client = (OakPupilClient as jest.Mock).mock.results[0]?.value;
    expect(client.init).toHaveBeenCalledTimes(1);
  });

  it("provides initial state", () => {
    const { result } = renderHook(() => useOakPupil(), { wrapper: Wrapper });
    expect(result.current.state).toEqual({ test: "state" });
  });

  it("updates state via onStateChange callback", async () => {
    const { result } = renderHook(() => useOakPupil(), { wrapper: Wrapper });
    const newState = { someKey: "newValue" };
    const client = (OakPupilClient as jest.Mock).mock.results[0]?.value;
    // Invoke stored callback
    act(() => {
      client._onStateChange?.(newState);
    });
    await waitFor(() => {
      expect(result.current.state).toEqual(newState);
    });
  });

  it("getAttempt returns mapped attempt", async () => {
    const { result } = renderHook(() => useOakPupil(), { wrapper: Wrapper });
    const attempt = await result.current.getAttempt("mockId", false);
    expect(attempt).toEqual({
      attemptId: "gCgkXUx42GY-9cAniQelm",
      createdAt: "2021-09-01T12:00:00Z",
      lessonData: { title: "Test Lesson", slug: "test-lesson" },
      browseData: { subject: "Test Subject", yearDescription: "Test Year" },
      sectionResults: {
        intro: {
          worksheetDownloaded: false,
          worksheetAvailable: false,
          isComplete: false,
        },
        "starter-quiz": { isComplete: true, grade: 3, numQuestions: 3 },
        video: {
          isComplete: false,
          duration: 0,
          muted: false,
          played: false,
          signedOpened: false,
          timeElapsed: 0,
          transcriptOpened: false,
        },
        "exit-quiz": { isComplete: false, grade: 3, numQuestions: 3 },
      },
    });
  });
});
