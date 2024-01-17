import { RefObject } from "react";
import MuxPlayerElement from "@mux/mux-player";

import getPercentageElapsed from "./getPercentageElapsed";

const duration = 50;
const timeElapsed = 46;

jest.mock("./getDuration", () => ({
  __esModule: true,
  default: () => duration,
}));
jest.mock("./getTimeElapsed", () => ({
  __esModule: true,
  default: () => timeElapsed,
}));

const createRef = () => {
  return {
    current: {},
  } as unknown as RefObject<MuxPlayerElement>;
};

describe("getPercentagedElapsed", () => {
  test("gets percentage elapsed", () => {
    expect(getPercentageElapsed(createRef())).toBe(92);
  });
});
