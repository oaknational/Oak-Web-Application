import { FC, useCallback, useMemo } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../Input";
import Button from "../../Button";
import DropdownSelect from "../../DropdownSelect";
// import OakError from "../../../errors/OakError";
// import errorReporter from "../../../common-lib/error-reporter";
import {
  FormDefinition,
  FormField,
} from "../../../common-lib/forms/FormDefinition";
import evaluateCondition from "../../../common-lib/forms/evaluateCondition";
import formToZod from "../../../common-lib/forms/formToZod";

// const reportError = errorReporter("DynamicForm.tsx");

type FormValues = Record<string, unknown>;

type DynamicFormFieldProps = {
  field: FormField;
  errorMessage?: string;

  // We can't provide the FieldValues shape to register
  // as it's dynamic, so pass a record but lose the type checking
  // of the field name
  register: UseFormRegister<FormValues>;
};

const DynamicFormField: FC<DynamicFormFieldProps> = ({
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
          label={field.label || undefined}
          placeholder={field.placeholder || undefined}
          {...register(field.name)}
          type={field.type === "email" ? "email" : "text"}
          error={errorMessage}
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
  formContext: FormValues
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

const DynamicForm: FC<DynamicFormProps> = ({ form, onSubmit }) => {
  const zodSchema = useMemo(() => {
    return formToZod(form);
  }, [form]);

  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    // resolver: zodResolver(z.any()),
    resolver: zodResolver(zodSchema),
    mode: "onBlur",

    // defaultValues: {
    //   email: "foo",
    // },
  });

  const { errors } = formState;

  /**
   * Note: using watch and recreating filterWFields on every
   * change probably makes us lose perf benefits from react-hook-form's
   * architecture. There's probably a more performant way of handling
   * dependent fields
   */
  const formValues = watch();

  const filterWFields = useCallback(
    (field) => evaluateConditionalField(field, formValues),
    [formValues]
  );

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        // @TODO: Handle submit
      })}
      // aria-describedby={descriptionId}
    >
      {form.fields.filter(filterWFields).map((field) => {
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
        label="Sign up"
        fullWidth
        htmlButtonProps={{ disabled: false /*todo: use `loading` state */ }}
        background="teachersHighlight"
      />
    </form>
  );
};

export default DynamicForm;
