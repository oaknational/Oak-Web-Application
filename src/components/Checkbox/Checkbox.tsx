import { FC } from "react";
// import styled from "styled-components";

interface CheckboxProps {
  labelText: string;
}

const Checkbox: FC<CheckboxProps> = (props: CheckboxProps) => {
  const { labelText } = props;
  return (
    <label htmlFor="oak-checkbox">
      <input type="checkbox" id="oak-checkbox"></input>
      <span>{labelText}</span>
    </label>
  );
};

export default Checkbox;
