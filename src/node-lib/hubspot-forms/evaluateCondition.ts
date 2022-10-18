import { FieldRenderCondition } from "./hubspotFormToZod";

const evaluateCondition = (
  condition: FieldRenderCondition,
  context
): boolean => {
  const contextVar = context[condition.field];

  switch (condition.operator) {
    case "in":
      return condition.value.includes(contextVar);
  }
};

export default evaluateCondition;
