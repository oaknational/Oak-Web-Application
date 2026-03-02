import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EYFSLessonGroupProvider } from "../EyfsLessonGroupProvider/EyfsLessonGroupProvider";

import { EYFSLessonCard } from "./EyfsLessonCard";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import type { EYFSLesson } from "@/node-lib/curriculum-api-2023/queries/eyfs/eyfsSchema";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockLesson: EYFSLesson = {
  title: "Introduction to counting",
  slug: "intro-counting",
  orderInUnit: 1,
  video: { muxPlaybackId: "playback-123", title: "Counting video" },
  downloadableResources: ["presentation"],
};

const mockLessonWithNullVideo: EYFSLesson = {
  title: "Lesson without video",
  slug: "lesson-without-video",
  orderInUnit: 1,
  video: { muxPlaybackId: null, title: null },
  downloadableResources: ["presentation"],
};

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

const renderCard = async (lesson: EYFSLesson = mockLesson) =>
  await waitFor(() => {
    act(() =>
      renderWithProviders()(
        <EYFSLessonGroupProvider>
          <EYFSLessonCard lesson={lesson} index={1} />
        </EYFSLessonGroupProvider>,
      ),
    );
  });

describe("EyfsLessonCard", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });

  it("renders lesson title and index", () => {
    renderCard();
    expect(screen.getByText("Introduction to counting")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("shows Show video button when video is inactive", () => {
    renderCard();
    expect(
      screen.getByRole("button", { name: /Show video/i }),
    ).toBeInTheDocument();
  });

  it("shows Hide video button when video is active", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(screen.getByRole("button", { name: /Show video/i }));
    expect(
      screen.getByRole("button", { name: /Hide video/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("video")).toBeInTheDocument();
  });

  it("toggles video visibility on button click", async () => {
    const user = userEvent.setup();
    renderCard();
    const showButton = screen.getByRole("button", { name: /Show video/i });
    await user.click(showButton);
    expect(
      screen.getByRole("button", { name: /Hide video/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("video")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Hide video/i }));
    expect(
      screen.getByRole("button", { name: /Show video/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("video")).not.toBeInTheDocument();
  });

  it("does not show Show/Hide video button when muxPlaybackId is null", () => {
    renderCard(mockLessonWithNullVideo);
    expect(
      screen.queryByRole("button", { name: /Show video/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Hide video/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Lesson without video")).toBeInTheDocument();
  });

  it("shows Download lesson when signed in", async () => {
    setUseUserReturn(mockLoggedIn);
    renderCard();
    const downloadButton = await screen.findByRole("button", {
      name: /Download lesson/i,
    });
    expect(downloadButton).toBeInTheDocument();
  });

  it("shows Sign in to download when signed out", async () => {
    setUseUserReturn(mockLoggedOut);
    renderCard();
    const signInButton = await screen.findByRole("button", {
      name: /Sign in to download/i,
    });
    expect(signInButton).toBeInTheDocument();
  });

  it("hides download button when no downloads are available", async () => {
    renderCard({ ...mockLesson, downloadableResources: [] });

    const downloadButton = screen.queryByRole("button", {
      name: /Download lesson/i,
    });
    expect(downloadButton).not.toBeInTheDocument();
  });
});
