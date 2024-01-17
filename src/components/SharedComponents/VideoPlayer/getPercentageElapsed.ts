import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

import getDuration from "./getDuration";
import getTimeElapsed from "./getTimeElapsed";

const getPercentageElapsed = (ref: RefObject<MuxPlayerElement>) => {
  const timeElapsed = getTimeElapsed(ref);
  const duration = getDuration(ref);
  if (!timeElapsed || !duration) {
    return 0;
  }
  return (timeElapsed / duration) * 100;
};

export default getPercentageElapsed;
