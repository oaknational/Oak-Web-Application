import { render, screen } from "@testing-library/react";

import VideoPlayer from "./";

describe("Video player", () => {
  test("It renders a video element on the page", () => {
    render(
      <VideoPlayer
        title="Test video"
        playbackId={"wgjCIRWRr00OSum34AWeU87lmSSCtNjEOViD9X5YSG8k"}
      />
    );

    const video = screen.getByRole("video");

    expect(video).toBeInTheDocument();
  });
});
