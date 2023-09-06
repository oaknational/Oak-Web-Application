import { assertUnreachable } from "../../utils/assertUnreachable";
import {
  FieldRenderCondition,
  FormDefinition,
  FormField,
} from "../../common-lib/forms/FormDefinition";

import {
  HubspotFormField,
  hubspotFormDefinitionSchema,
  HubspotDependencyFilter,
} from "./hubspotSchemas";

/**
 * Transformations to parse and convert from a hubspot
 * form schema to our internal representation
 *
 * See hubspot-forms.md for more context
 */

export const transformHubspotFilter = (
  filter: HubspotDependencyFilter,
  dependentFieldName: string,
): FieldRenderCondition => {
  if (Array.isArray(filter.strValues) && filter.strValues.length > 0) {
    return {
      field: dependentFieldName,
      operator: "in",
      value: filter.strValues,
    };
  }

  throw new Error("Encountered unknown form field filters");
};

const addConditions = (
  field: FormField,
  filters: HubspotDependencyFilter[],
  dependentFieldName: string,
): FormField => {
  const conditions = filters.map((filter) =>
    transformHubspotFilter(filter, dependentFieldName),
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
        type: field.fieldType,
        options: field.options.map((opt) => ({
          label: opt.label,
          value: opt.value,
        })),
      };
    default:
      assertUnreachable(
        field,
        new Error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `Encountered unknown form field type: ${(field as any)?.type}`,
        ),
      );
  }
};

const transformFieldAndDependents = (
  field: HubspotFormField,
): FormField | FormField[] => {
  if (field.dependentFieldFilters && field.dependentFieldFilters?.length > 0) {
    /**
     * If our field has dependent fields, transform each of those as well,
     * returning them all at the top level in our array, as the filtering logic
     * in addConditions will encode the dependency field name
     */
    const { dependentFieldFilters, ...restOfField } = field;

    const mainField = transformField({
      ...restOfField,
      dependentFieldFilters: [],
    });

    const dependentFields = dependentFieldFilters.map((dependentFieldDef) =>
      addConditions(
        transformField(dependentFieldDef.dependentFormField),
        dependentFieldDef.filters,
        restOfField.name,
      ),
    );

    return [mainField, ...dependentFields];
  }

  return transformField(field);
};

export const transformHubspotForm = (formRaw: unknown): FormDefinition => {
  const form = hubspotFormDefinitionSchema.parse(formRaw);

  const flattenedFields = form.formFieldGroups.flatMap((fieldGroup) =>
    fieldGroup.fields.flatMap(transformFieldAndDependents),
  );

  return {
    formId: form.guid,
    portalId: form.portalId,
    submitButtonLabel: form.submitText,
    successMessage: form.inlineMessage,
    fields: flattenedFields,
  };
};
