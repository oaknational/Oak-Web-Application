import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

/**
 * Gets current playback time video from the video player ref.
 * Rounds down, and returns null if time not available.
 */
const getTimeElapsed = (ref: RefObject<MuxPlayerElement>) => {
  const currentTime = ref.current?.currentTime;
  if (typeof currentTime === "number" && !Number.isNaN(currentTime)) {
    return Math.floor(currentTime);
  }

  return null;
};

export default getTimeElapsed;
