import { FieldRenderCondition } from "./FormDefinition";
import evaluateCondition from "./evaluateCondition";

describe("evaluateCondition", () => {
  it("evaluateCondition", () => {
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
