
export type FieldValue = string | number | boolean;

export type FieldRenderCondition = {
  field: string;
} & ({
  operator: "in";
  value: FieldValue[];
} |
{
  operator: "eq";
  value: FieldValue;
});

export type FormFieldBase = {
  name: string;
  label: string | null;
  required: boolean;
  default: string | null;
  placeholder: string | null;
  description: string | null;
  hidden: boolean | null;
  renderWhen?: FieldRenderCondition[];
};

export type FormField = FormFieldBase &
  ({
    type: "string" | "email";
  } |
  {
    // We should probably find a better way of modelling whatever "booleancheckbox" is supposed to be
    type: "select" | "checkbox" | "radio" | "booleancheckbox";
    options: Array<{ label: string; value: string; }>;
  });

export type FormFieldType = FormField["type"];

export type FormDefinition = {
  formId: string;
  portalId: number;
  submitButtonLabel: string | null;
  successMessage: string | null;
  fields: FormField[];
};
