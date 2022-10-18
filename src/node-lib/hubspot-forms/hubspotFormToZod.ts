import { z } from "zod";

import { assertUnreachable } from "../../utils/assertUnreachable";

export type FormFieldBase = {
  name: string;
  label: string | null;
  required: boolean;
  default: string | null;
  placeholder: string | null;
  description: string | null;
  hidden: boolean | null;
};

export type FormField = FormFieldBase &
  (
    | {
        type: "string" | "email";
      }
    | {
        type: "select";
        options: Array<{ label: string; value: string }>;
      }
  );

export type FormFieldType = FormField["type"];

export type FormDefinition = {
  formId: string;
  portalId: number;
  submitButtonLabel: string | null;
  successMessage: string | null;
  fields: FormField[];
};

const fieldToZod = (formField: FormField) => {
  let schema;

  switch (formField.type) {
    case "string":
      schema = z.string();
      break;
    case "email":
      schema = z.string().email();
      break;
    case "select":
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

const hubspotFormToZod = (form: FormDefinition) => {
  const fieldSchema = form.fields.reduce((acc, field) => {
    return {
      [field.name]: fieldToZod(field),
      ...acc,
    };
  }, {});

  return z.object(fieldSchema);
};

export default hubspotFormToZod;
