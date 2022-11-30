import { z } from "zod";

import { assertUnreachable } from "../../utils/assertUnreachable";

import { FormField, FormDefinition } from "./FormDefinition";

const emptyStringToUndefined = (maybeString: unknown) =>
  typeof maybeString === "string" && maybeString === ""
    ? undefined
    : maybeString;

export const fieldToZod = (formField: FormField) => {
  let schema;
  const isRequired =
    formField.required || typeof formField.required === "undefined";

  switch (formField.type) {
    case "string":
      schema = z
        .string()
        .min(1, { message: `${formField.label} can't be empty` });
      break;
    case "email":
      schema = z
        .string()
        .min(1, { message: `${formField.label} can't be empty` })
        .email({ message: "Email not valid" });
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

  if (isRequired) {
    return schema;
  } else {
    /**
     * We want to coerce empty strings into undefined to better handle
     * form submissions (react-hook-form will pass an empty string
     * which will in turn fail validation)
     */
    return z.preprocess(emptyStringToUndefined, schema.optional());
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
