import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

/**
 * Gets duration of video from the video player ref.
 * Rounds down, and returns null if duration not available.
 */
const getDuration = (ref: RefObject<MuxPlayerElement>) => {
  const duration = ref.current?.duration;
  if (typeof duration === "number" && !isNaN(duration)) {
    return Number(duration.toFixed(2));
  }

  return null;
};

export default getDuration;
