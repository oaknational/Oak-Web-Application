import { pickQuizTooltip } from "./pickQuizTooltip";

describe("pickQuizTooltip", () => {
  it("returns undefined when there is no recognised answer type", () => {
    expect(pickQuizTooltip({})).toBeUndefined();
  });
});
