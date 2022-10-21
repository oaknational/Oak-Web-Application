import { assertUnreachable } from "../../utils/assertUnreachable";

import {
  HubspotFormDefinition,
  HubspotFormField,
  HubspotFormFilter,
} from "./HubspotFormDefinition";
import {
  FieldRenderCondition,
  FormDefinition,
  FormField,
} from "./hubspotFormToZod";

export const transformHubspotFilter = (
  filter: HubspotFormFilter,
  dependentFieldName: string
): FieldRenderCondition => {
  if (Array.isArray(filter.strValues) && filter.strValues.length > 0) {
    return {
      field: dependentFieldName,
      operator: "in",
      value: filter.strValues,
    };
  }

  assertUnreachable(
    filter,
    new Error("Encountered unknown form field filters")
  );
};

const addConditions = (
  field: FormField,
  filters: HubspotFormFilter[],
  dependentFieldName: string
): FormField => {
  const conditions = filters.map((filter) =>
    transformHubspotFilter(filter, dependentFieldName)
  );

  return { ...field, renderWhen: conditions };
};

const transformField = (field: HubspotFormField): FormField => {
  const baseFields = {
    name: field.name,
    description: field.description || null,
    label: field.label || null,
    hidden: field.hidden || false,
    default: field.defaultValue || null,
    placeholder: field.placeholder || null,
    required: field.required ?? true,
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

const transformFieldAndDependents = (field: HubspotFormField): FormField[] => {
  if (field.dependentFieldFilters?.length > 0) {
    const { dependentFieldFilters, ...restOfField } = field;

    const mainField = transformField({
      ...restOfField,
      dependentFieldFilters: [],
    });

    const dependentFields = dependentFieldFilters.map((dependentFieldDef) =>
      addConditions(
        transformField(dependentFieldDef.dependentFormField),
        dependentFieldDef.filters,
        restOfField.name
      )
    );

    return [mainField, ...dependentFields];
  }

  return [transformField(field)];
};

export const transformHubspotForm = (
  form: HubspotFormDefinition
): FormDefinition => {
  const flattenedFields = form.formFieldGroups.flatMap((fieldGroup) =>
    fieldGroup.fields.flatMap(transformFieldAndDependents)
  );

  return {
    formId: form.guid,
    portalId: form.portalId,
    submitButtonLabel: form.submitText || null,
    successMessage: form.inlineMessage || null,
    fields: flattenedFields,
  };
};
