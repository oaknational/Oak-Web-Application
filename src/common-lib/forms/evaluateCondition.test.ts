import { describe, expect, it } from "vitest";

import { FieldRenderCondition } from "./FormDefinition";
import evaluateCondition from "./evaluateCondition";

describe("evaluateCondition", () => {
  it("should handle the `eq` operator", () => {
    const condition: FieldRenderCondition = {
      field: "user_type",
      operator: "eq",
      value: "Teacher",
    };

    expect(evaluateCondition(condition, { user_type: "Teacher" })).toBe(true);
    expect(evaluateCondition(condition, { user_type: "Parent" })).toBe(false);
    expect(evaluateCondition(condition, {})).toBe(false);
  });

  it("should handle the `in` operator", () => {
    const condition: FieldRenderCondition = {
      field: "user_type",
      operator: "in",
      value: ["Teacher", "Pupil"],
    };

    expect(evaluateCondition(condition, { user_type: "Teacher" })).toBe(true);
    expect(evaluateCondition(condition, { user_type: "Parent" })).toBe(false);
    expect(evaluateCondition(condition, {})).toBe(false);
  });
});
