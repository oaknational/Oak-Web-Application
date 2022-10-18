import { assertUnreachable } from "../../utils/assertUnreachable";
import {
  HubspotFormDefinition,
  HubspotFormField,
} from "./HubspotFormDefinition";
import { FormDefinition, FormField } from "./hubspotFormToZod";

const transformField = (field: HubspotFormField): FormField => {
  const baseFields = {
    name: field.name,
    description: field.description || null,
    label: field.label || null,
    hidden: field.hidden || false,
    default: field.defaultValue || null,
    placeholder: field.placeholder || null,
    required: field.required || true,
  };

  if (field.name === "email") {
    /**
     * Our main hubspot form has `{ type:"string", fieldType:"text"}` but hubspot treats it
     * as an email with appropriate validation, so hack around it here so we handle
     * it correctly internally
     */
    return { ...baseFields, type: "email" };
  }

  switch (field.type) {
    case "string":
      return { ...baseFields, type: "string" };
    case "enumeration":
      return {
        ...baseFields,
        type: "select",
        options: field.options.map((opt) => ({
          label: opt.label,
          value: opt.value,
        })),
      };
    default:
      assertUnreachable(
        field,
        new Error("Encountered unknown form field type")
      );
  }
};

export const transformHubspotForm = (
  form: HubspotFormDefinition
): FormDefinition => {
  const flattenedFields = form.formFieldGroups.flatMap((fieldGroup) =>
    fieldGroup.fields.map(transformField)
  );

  return {
    formId: form.guid,
    portalId: form.portalId,
    submitButtonLabel: form.submitText || null,
    successMessage: form.inlineMessage || null,
    fields: flattenedFields,
  };
};
