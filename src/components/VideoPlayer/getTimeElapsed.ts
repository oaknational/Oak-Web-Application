import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

const getTimeElapsed = (ref: RefObject<MuxPlayerElement>) => {
  if (!ref.current) {
    return 0;
  }
  if (
    typeof ref.current.currentTime === "number" &&
    !isNaN(ref.current.currentTime)
  ) {
    return Math.floor(ref.current.currentTime);
  }

  return null;
};

export default getTimeElapsed;
