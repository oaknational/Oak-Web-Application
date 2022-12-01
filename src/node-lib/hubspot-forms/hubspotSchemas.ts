import { z } from "zod";

/**
 * See hubspotFormFieldSchema and hubspotFormDefinitionSchema for the main schemas
 * and inferred types
 *
 * The schema gets a bit convoluted here due to some recursion and problems
 * with zod not allowing extending/merging object schemas with discriminated unions
 *
 * We construct the formFieldBase - this is all the information except for the actual
 * field type and sub-fields (dependentFieldFilters).
 *
 * To avoid trying to model the recursion in zod we declare dependent fields 1 level deep,
 * constructing the `fieldWithType` schema that represents a fieldWithType as a discriminated union.
 *
 * We then construct hubspotFormFieldSchema by extending it with the dependentFieldFilters, but we have
 * to jump through the hoop of re-declaring the discriminated union
 *
 * n.b. The data returned from the API for both fieldBase and hubspotFormDefinitionSchema contain many
 * more keys than declared on the schemas, but I've omitted the ones we don't care about currently
 */

const hubspotFormOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const fieldBase = z.object({
  name: z.string(),
  label: z.string().nullish().default(null),
  description: z.string().nullish().default(null),
  required: z.boolean().nullish().default(null),
  enabled: z.boolean().nullish().default(null),
  hidden: z.boolean().nullish().default(false),
  defaultValue: z.string().nullish().default(null),
  placeholder: z.string().nullish().default(null),
});

const stringField = fieldBase.extend({
  type: z.literal("string"),
  fieldType: z.enum([
    "text",
    // Also supported in transforms but not front end
    // "phonenumber"
  ]),
});

const enumField = fieldBase.extend({
  type: z.literal("enumeration"),
  fieldType: z.enum([
    "select",
    /**
     * These additional types are supported by the transformation
     * layer, but don't exist in the front-end currently, so they're
     * disabled to avoid bugs
     *
     * "checkbox",
     * "radio",
     * "booleancheckbox",
     */
  ]),
  options: z.array(hubspotFormOptionSchema),
});

const fieldWithType = z.discriminatedUnion("type", [stringField, enumField]);

/**
 * The JSON-encoded logic for rendering a dependent field
 * The API returns a load of junk data for this, for example checking
 * the value of a checkbox will have the correct data in `strValues`, but also
 * contain misleading values like
 *     strValue: "", boolValue: false, numberValue: 0, numberValues: []
 */
export const dependentFieldFilterObject = z.object({
  operator: z.string(),
  strValue: z.string(),
  boolValue: z.boolean(),
  numberValue: z.number(),
  strValues: z.array(z.string()),
  numberValues: z.array(z.number()),
});

export type HubspotDependencyFilter = z.infer<
  typeof dependentFieldFilterObject
>;

/**
 * Confusing naming from hubspot here the key: `dependentFieldFilters`
 * contains both the field shape and the actual filters, not just
 * the filters for a dependent field..
 */
const fieldDependencyObject = z.object({
  dependentFieldFilters: z
    .array(
      z.object({
        dependentFormField: fieldWithType,
        filters: z.array(dependentFieldFilterObject),
      })
    )
    .nullish(),
});

export const hubspotFormFieldSchema = z.discriminatedUnion("type", [
  stringField.merge(fieldDependencyObject),
  enumField.merge(fieldDependencyObject),
]);

export type HubspotFormField = z.infer<typeof hubspotFormFieldSchema>;

// The actual form object
export const hubspotFormDefinitionSchema = z.object({
  guid: z.string().uuid(),
  portalId: z.number(),
  submitText: z.string(),
  inlineMessage: z.string(),
  formFieldGroups: z.array(
    z.object({
      fields: z.array(hubspotFormFieldSchema),
    })
  ),
});

export type HubspotFormDefinition = z.infer<typeof hubspotFormDefinitionSchema>;
