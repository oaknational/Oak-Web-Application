import evaluateCondition from "./evaluateCondition";

describe("evaluateCondition", () => {
  it("evaluateCondition", () => {
    const condition = {
      field: "user_type",
      operator: "in",
      value: ["Teacher"],
    };

    expect(evaluateCondition(condition, { user_type: "Teacher" })).toBe(true);
    expect(evaluateCondition(condition, {})).toBe(false);
});
});
