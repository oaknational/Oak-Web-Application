import { z } from "zod";

import { assertUnreachable } from "../../utils/assertUnreachable";

import { FormField, FormDefinition } from "./FormDefinition";

const fieldToZod = (formField: FormField) => {
  let schema;

  switch (formField.type) {
    case "string":
      schema = z.string().min(1);
      break;
    case "email":
      schema = z.string().email();
      break;
    case "select":
    case "radio":
    case "checkbox":
    case "booleancheckbox":
      // Casting required because zod can't infer values coming through at runtime
      schema = z.enum(
        formField.options.map((s) => s.value) as [string, ...string[]]
      );
      break;
    default:
      assertUnreachable(
        formField,
        new Error("Encountered unknown form field type")
      );
  }

  if (formField.required || typeof formField.required === "undefined") {
    return schema;
  } else {
    return schema.optional();
  }
};

const formToZod = (form: FormDefinition) => {
  const fieldSchema = form.fields.reduce((acc, field) => {
    return {
      [field.name]: fieldToZod(field),
      ...acc,
    };
  }, {});

  return z.object(fieldSchema);
};

export default formToZod;
