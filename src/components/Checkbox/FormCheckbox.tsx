import React, { FC } from "react";
import { ControllerProps, useFormState, useWatch } from "react-hook-form";

import Checkbox, { CheckboxProps } from "./Checkbox";

const Controller = ({ control, register, name, rules, render }) => {
  const value = useWatch({
    control,
    name,
  });
  const { errors } = useFormState({
    control,
    name,
  });
  const props = register(name, rules);

  console.log(errors);

  return render({
    value,
    onChange: (e) =>
      props.onChange({
        target: {
          name,
          value: e.target.value,
        },
      }),
    onBlur: props.onBlur,
    name: props.name,
  });
};

const FormCheckbox: FC<ControllerProps & CheckboxProps> = (
  { name, control, id, register },
  props
) => {
  return (
    <Controller
      {...{
        control,
        register,
        name: "lastName",
        rules: {
          required: true,
        },
        render: (props) => (
          <Checkbox
            // onChange={onChange} // send value to hook form
            // checked={value}
            // inputRef={ref}
            id={id}
            name={name}
            {...props}
          />
        ),
      }}
    />
    // <Controller
    //   {...props}
    //   control={control}
    //   name={name}
    //   render={({
    //     field: { onChange, onBlur, value, name, ref },
    //     // fieldState: { invalid, isTouched, isDirty, error },
    //     // formState,
    //   }) => (
    //     <Checkbox
    //       onChange={onChange} // send value to hook form
    //       checked={value}
    //       inputRef={ref}
    //       id={id}
    //       name={name}
    //     />
    //   )}
    // />
  );
};

export default FormCheckbox;
