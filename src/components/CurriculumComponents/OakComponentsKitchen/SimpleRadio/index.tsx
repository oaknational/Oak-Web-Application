import {
  ChangeEvent,
  Fragment,
  InputHTMLAttributes,
  createContext,
  useContext,
} from "react";
import { VisuallyHidden, useFocusRing } from "react-aria";
import styled, { css } from "styled-components";

import getColorByName from "@/styles/themeHelpers/getColorByName";

type ContextProps = {
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: null | string;
};
const Context = createContext<ContextProps>({
  name: "",
  value: null,
  onChange: () => {},
});

export function RadioGroup({
  name,
  value,
  children,
  onChange = () => {},
}: ContextProps & { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ name, onChange, value }}>
      <Fragment>{children}</Fragment>
    </Context.Provider>
  );
}

export const StyledRadio = styled.span<{
  isSelected: boolean;
  isFocusVisible: boolean;
  hasError?: boolean;
}>`
  height: 24px;
  width: 24px;
  border: 2px solid
    ${(props) =>
      props.isFocusVisible
        ? getColorByName("black")
        : getColorByName("grey50")};
  border-radius: 50%;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  align-items: center;
  background: white;
  justify-content: center;
  cursor: pointer;
  margin-right: 16px;
  ${(props) =>
    props.isFocusVisible &&
    css`
      box-shadow: 0 0 0 2px ${getColorByName("lemon")};
    `}

  &::after {
    content: "";
    height: ${(props) => (props.isSelected ? "20px" : "16px")};
    width: ${(props) => (props.isSelected ? "20px" : "16px")};
    background: ${(props) =>
      props.isSelected ? getColorByName("black") : getColorByName("white")};
    display: block;
    position: absolute;
    border-radius: 50%;
    ${(props) =>
      props.isSelected &&
      css`
        border: 2px solid ${getColorByName("white")};
      `}
  }

  &:active {
    border: 2px solid ${getColorByName("black")};
    box-shadow: 0 0 0 3px ${getColorByName("lemon")};
  }

  &:hover {
    &::after {
      background: ${getColorByName("black")};
    }
  }

  &:focus {
    border: 2px solid ${getColorByName("black")};
    box-shadow: 0 0 0 3px ${getColorByName("lemon")};
  }
`;

export function RadioButton(
  props: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "type" | "name"
  > & { children: React.ReactNode; disabled?: boolean },
) {
  const context = useContext(Context);
  const { children, ...inputProps } = props;
  const { isFocusVisible, focusProps } = useFocusRing();
  const isSelected = context.value === props.value;

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "12px",
        opacity: props.disabled ? 0.4 : 1,
      }}
    >
      <VisuallyHidden>
        <input
          {...inputProps}
          {...focusProps}
          type="radio"
          name={context.name}
          onChange={context.onChange}
          checked={isSelected}
        />
      </VisuallyHidden>

      <StyledRadio isSelected={isSelected} isFocusVisible={isFocusVisible} />

      {children}
    </label>
  );
}
