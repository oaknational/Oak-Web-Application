import { z } from "zod";

const fieldValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export type FieldValue = z.infer<typeof fieldValueSchema>;

const fieldRenderConditionSchema = z.discriminatedUnion("operator", [
  z.object({
    operator: z.literal("in"),
    field: z.string(),
    value: z.array(fieldValueSchema),
  }),
  z.object({
    operator: z.literal("eq"),
    field: z.string(),
    value: fieldValueSchema,
  }),
]);

export type FieldRenderCondition = z.infer<typeof fieldRenderConditionSchema>;

const formFieldBaseSchema = z.object({
  name: z.string(),
  label: z.string().nullish(),
  required: z.boolean(),
  default: z.string().nullish(),
  placeholder: z.string().nullish(),
  description: z.string().nullish(),
  hidden: z.boolean().nullish(),
  renderWhen: z.array(fieldRenderConditionSchema).nullish(),
});

const fieldOption = z.object({ label: z.string(), value: z.string() });

const formFieldSchema = z.discriminatedUnion("type", [
  // Annoyingly zod won't infer with a z.enum([]) so we need N x z.literals
  formFieldBaseSchema.extend({ type: z.literal("string") }),
  formFieldBaseSchema.extend({ type: z.literal("email") }),
  formFieldBaseSchema.extend({
    type: z.literal("select"),
    options: z.array(fieldOption),
  }),
  formFieldBaseSchema.extend({
    type: z.literal("checkbox"),
    options: z.array(fieldOption),
  }),
  formFieldBaseSchema.extend({
    type: z.literal("radio"),
    options: z.array(fieldOption),
  }),
  formFieldBaseSchema.extend({
    type: z.literal("booleancheckbox"),
    options: z.array(fieldOption),
  }),
]);

export type FormField = z.infer<typeof formFieldSchema>;

export type FormFieldType = FormField["type"];

export const formDefinitionSchema = z.object({
  formId: z.string(),
  portalId: z.number(),
  submitButtonLabel: z.string().nullish(),
  successMessage: z.string().nullish(),
  fields: z.array(formFieldSchema),
});
export type FormDefinition = z.infer<typeof formDefinitionSchema>;
