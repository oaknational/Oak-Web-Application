import { getVideoPlaybackId } from "./getVideoPlaybackId";

describe("getVideoPlaybackId", () => {
  it("returns the sign-language playback id when enabled and available", () => {
    expect(
      getVideoPlaybackId({
        signLanguageOn: true,
        videoMuxPlaybackId: "standard",
        videoWithSignLanguageMuxPlaybackId: "signed",
      }),
    ).toBe("signed");
  });

  it("falls back to the standard playback id", () => {
    expect(
      getVideoPlaybackId({
        signLanguageOn: true,
        videoMuxPlaybackId: "standard",
      }),
    ).toBe("standard");
    expect(
      getVideoPlaybackId({
        signLanguageOn: false,
        videoMuxPlaybackId: "standard",
        videoWithSignLanguageMuxPlaybackId: "signed",
      }),
    ).toBe("standard");
  });
});
