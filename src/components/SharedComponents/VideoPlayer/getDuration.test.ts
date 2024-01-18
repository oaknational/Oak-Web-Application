import { describe, expect, it } from "vitest";
import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

import getDuration from "./getDuration";

const createRef = (duration: number | undefined) => {
  return {
    current: {
      duration,
    },
  } as unknown as RefObject<MuxPlayerElement>;
};

describe("getDuration", () => {
  it("gets duration rounded down", () => {
    const ref = createRef(54.5467948);
    expect(getDuration(ref)).toBe(54);
  });
  it("returns null if duration undefined", () => {
    const ref = createRef(undefined);
    expect(getDuration(ref)).toBe(null);
  });
  it("returns null if duration NaN", () => {
    const ref = createRef(NaN);
    expect(getDuration(ref)).toBe(null);
  });
});
