import { FC } from "react";
import styled from "styled-components";

const CheckboxLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;

  input[type="checkbox"]:focus + svg {
    // TODO: add focus ring component to replace this
    outline: 0.25rem auto -webkit-focus-ring-color;
    outline-offset: 0.25rem;
  }
`;

const ScreenReaderCheckbox = styled.input`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0.0001;
`;

const CheckboxLabelText = styled.span`
  margin-left: 0.5rem;
  margin-right: 1rem;
`;

interface CheckboxProps {
  labelText?: string;
  id: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: FC<CheckboxProps> = (props) => {
  const { labelText, checked, onChange, id } = props;
  return (
    <CheckboxLabel htmlFor="oak-checkbox" onClick={onChange}>
      <ScreenReaderCheckbox
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {/*  the background */}
        <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill="white" />

        {/* the checkmark */}
        {checked && (
          <path
            d="M10.0664 16.8233C10.3008 17.0589 10.6992 17.0589 10.9336 16.8233L17.8242 9.8966C18.0586 9.66099 18.0586 9.26047 17.8242 9.02487L16.9805 8.1767C16.7461 7.9411 16.3711 7.9411 16.1367 8.1767L10.5117 13.8312L7.86328 11.1924C7.62891 10.9568 7.25391 10.9568 7.01953 11.1924L6.17578 12.0406C5.94141 12.2762 5.94141 12.6767 6.17578 12.9123L10.0664 16.8233Z"
            fill="#4D4D4D"
          />
        )}
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="23"
          rx="3.5"
          stroke="#4D4D4D"
        />
      </svg>
      {labelText && <CheckboxLabelText>{labelText}</CheckboxLabelText>}
    </CheckboxLabel>
  );
};

export default Checkbox;
