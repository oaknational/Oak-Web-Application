import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

import getTimeElapsed from "./getTimeElapsed";

const createRef = (currentTime: number | undefined) => {
  return {
    current: {
      currentTime,
    },
  } as unknown as RefObject<MuxPlayerElement>;
};

describe("getTimeElapsed", () => {
  test("gets currentTime rounded down", () => {
    const ref = createRef(54.5467948);
    expect(getTimeElapsed(ref)).toBe(54);
  });
  test("returns null if currentTime undefined", () => {
    const ref = createRef(undefined);
    expect(getTimeElapsed(ref)).toBe(null);
  });
  test("returns null if currentTime NaN", () => {
    const ref = createRef(NaN);
    expect(getTimeElapsed(ref)).toBe(null);
  });
});
