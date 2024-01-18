import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

import getSubtitleTrack from "./getSubtitleTrack";

const subtitleTrack = { kind: "subtitles", language: "en-GB" };
const ref = {
  current: {
    textTracks: [{ kind: "metadata" }, subtitleTrack],
  },
} as unknown as RefObject<MuxPlayerElement>;

describe("getSubtitleTrack", () => {
  it("gets subtitle track", () => {
    expect(getSubtitleTrack(ref)).toBe(subtitleTrack);
  });
});
