import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EYFSLessonGroupProvider } from "../EyfsLessonGroupProvider/EyfsLessonGroupProvider";

import { EYFSLessonCard } from "./EyfsLessonCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import type { EYFSLesson } from "@/node-lib/curriculum-api-2023/queries/eyfs/eyfsSchema";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";

const mockLesson: EYFSLesson = {
  title: "Introduction to counting",
  slug: "intro-counting",
  orderInUnit: 1,
  video: { muxPlaybackId: "playback-123", title: "Counting video" },
};

const mockLessonWithNullVideo: EYFSLesson = {
  title: "Lesson without video",
  slug: "lesson-without-video",
  orderInUnit: 1,
  video: { muxPlaybackId: null, title: null },
};

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer");

const renderCard = (lesson: EYFSLesson = mockLesson) =>
  renderWithTheme(
    <EYFSLessonGroupProvider>
      <EYFSLessonCard lesson={lesson} index={1} />
    </EYFSLessonGroupProvider>,
  );

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

  it("shows Download lesson when signed in", () => {
    setUseUserReturn(mockLoggedIn);
    renderCard();
    expect(
      screen.getByRole("button", { name: /Download lesson/i }),
    ).toBeInTheDocument();
  });

  it("shows Sign in to download when signed out", () => {
    setUseUserReturn(mockLoggedOut);
    renderCard();
    expect(
      screen.getByRole("button", { name: /Sign in to download/i }),
    ).toBeInTheDocument();
  });
});
