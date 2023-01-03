import { assertUnreachable } from "../../utils/assertUnreachable";

import { FieldRenderCondition, FieldValue } from "./FormDefinition";

const evaluateCondition = (
  condition: FieldRenderCondition,
  context: Record<string, unknown>
): boolean => {
  const contextVar = context[condition.field];

  switch (condition.operator) {
    case "in":
      // Casting FieldValue here because if it's not of the FieldValue
      // type the arr.includes() fail will return false anyway
      return condition.value.includes(contextVar as FieldValue);
    case "eq":
      return condition.value == contextVar;
    default:
      assertUnreachable(
        condition,
        new Error("Encountered unknown field render condition")
      );
  }
};

export default evaluateCondition;
