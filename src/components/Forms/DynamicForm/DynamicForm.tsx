import { FC, useCallback, useMemo } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../Input";
import Button from "../../Button";
import DropdownSelect from "../../DropdownSelect";
import {
  FormDefinition,
  FormField,
} from "../../../common-lib/forms/FormDefinition";
import evaluateCondition from "../../../common-lib/forms/evaluateCondition";
import formToZod from "../../../common-lib/forms/formToZod";

type FormValues = Record<string, unknown>;

type DynamicFormFieldProps = {
  field: FormField;
  errorMessage?: string;

  // We can't provide the FieldValues shape to register
  // as it's dynamic, so pass a record but lose the type checking
  // of the field name
  register: UseFormRegister<FormValues>;
};

export const DynamicFormField: FC<DynamicFormFieldProps> = ({
  field,
  register,
  errorMessage,
}) => {
  switch (field.type) {
    case "string":
    case "email":
      return (
        <Input
          // @TODO: Add proper `id` prop
          id={field.name}
          label={field.label || ""}
          placeholder={field.placeholder || undefined}
          {...register(field.name)}
          type={field.type === "email" ? "email" : "text"}
          error={errorMessage}

          /**
           * Do we want to set `required`? I'm in favour of using
           * the native form behaviors, but it stops the error
           * messages showing on an attempted submission - RM
           *
           * required={field.required}
           */
        />
      );
    case "select":
      return (
        <DropdownSelect
          // @TODO: Add proper `id` prop
          id={field.name}
          $mt={32}
          // @TODO: Handle missing label case.
          // Should it be tighter at the parse layer?
          label={field.label || ""}
          placeholder={field.placeholder || undefined}
          listItems={field.options}
          {...register(field.name)}
          error={errorMessage}
          // required={field.required}
        />
      );
    default:
      return (
        <div>
          Input not found: <code>{field.type}</code>
        </div>
      );
  }
};

const evaluateConditionalField = (
  field: FormField,
  formContext: FormValues,
) => {
  if (field.renderWhen && field.renderWhen?.length > 0) {
    const shouldRender = field.renderWhen?.every((condition) => {
      return evaluateCondition(condition, formContext);
    });

    return shouldRender;
  }

  return true;
};

export type DynamicFormProps = {
  form: FormDefinition;
  onSubmit: (values: FormValues) => Promise<string | void>;
};

const isFieldVisible = (field: FormField) => !field.hidden;

const DynamicForm: FC<DynamicFormProps> = ({ form, onSubmit }) => {
  const zodSchema = useMemo(() => {
    return formToZod(form);
  }, [form]);

  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    resolver: zodResolver(zodSchema),
    mode: "onBlur",
    /**
     * When we figure out a mechanism for getting the user's
     * previous submission data, we should pass it in here for progressive
     * fields (n.b. that should live in the Hubspot wrapper, not here)
     * defaultValues: {}
     */
  });

  const { errors } = formState;

  /**
   * Note: using watch and recreating isRenderConditionSatisfied on every
   * change probably makes us lose perf benefits from react-hook-form's
   * architecture. There's probably a more performant way of handling
   * dependent fields
   */
  const formValues = watch();

  const isRenderConditionSatisfied = useCallback(
    (field: FormField) => evaluateConditionalField(field, formValues),
    [formValues],
  );

  const fieldsToRender = form.fields
    .filter(isFieldVisible)
    .filter(isRenderConditionSatisfied);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      // aria-describedby={descriptionId}
    >
      {fieldsToRender.map((field) => {
        const errorMessage = errors?.[field.name]?.message;

        return (
          <DynamicFormField
            key={field.name}
            field={field}
            register={register}
            errorMessage={errorMessage}
          />
        );
      })}

      <Button
        $mt={24}
        label={form.submitButtonLabel}
        $fullWidth
        htmlButtonProps={{ disabled: false /*todo: use `loading` state */ }}
        background="teachersHighlight"
      />
    </form>
  );
};

export default DynamicForm;
