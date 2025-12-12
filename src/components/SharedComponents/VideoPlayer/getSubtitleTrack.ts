import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

const getSubtitleTrack = (ref: RefObject<MuxPlayerElement>) => {
  if (ref.current?.textTracks) {
    const textTracks = Array.from(ref.current.textTracks);

    return textTracks.find((textTrack) => textTrack.kind === "subtitles");
  }
};

export default getSubtitleTrack;
