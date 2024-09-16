import styled from "styled-components";

import {
  OakBox,
  OakBoxProps,
  OakFlex,
  OakLabel,
  OakLabelProps,
} from "@/styles/oakThemeApp";

const RadioButtonLabel = styled(OakLabel)<OakLabelProps>`
  cursor: pointer;
  display: flex;
  gap: 8px; // TODO: replace with spacing token
`;

const HiddenRadioButtonInput = styled.input.attrs({
  type: "radio",
})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const RadioButtonFocus = styled(OakBox)<OakBoxProps>`
  box-shadow: ${`inset 0 0 0 0.13rem #ffe555`}; // TODO: replace with colour token
`;
export type RadioTheme = { slug: string; label: string };

export const isRadioTheme = (u: unknown): u is RadioTheme => {
  return (
    typeof u === "object" &&
    u !== null &&
    typeof (u as RadioTheme).slug === "string" &&
    typeof (u as RadioTheme).label === "string"
  );
};

export const ThemeRadioButton = ({
  theme,
  isChecked,
  isFocussed,
  onChange,
  onFocus,
}: {
  theme: RadioTheme;
  isChecked: boolean;
  isFocussed: boolean;
  onChange: (theme: RadioTheme) => void;
  onFocus: (value: string | undefined) => void;
}) => {
  return (
    <RadioButtonLabel htmlFor={theme.slug}>
      <HiddenRadioButtonInput
        value={theme.slug}
        id={theme.slug}
        checked={isChecked}
        onChange={() => onChange(theme)}
        tabIndex={0}
        onFocus={() => onFocus(theme.slug)}
      />
      <OakFlex
        $height={"all-spacing-6"}
        $width="all-spacing-6"
        $borderColor={"black"}
        $flexGrow={0}
        $flexShrink={0}
        $alignItems={"center"}
        $justifyContent={"center"}
        $background="bg-primary"
        $ba="border-solid-m"
        $borderRadius="border-radius-circle"
      >
        {isChecked && (
          <OakBox
            $height={"all-spacing-4"}
            $width="all-spacing-4"
            $background="black"
            $position="absolute"
            $borderRadius="border-radius-circle"
          />
        )}
        {isFocussed && (
          <RadioButtonFocus
            $height={"all-spacing-7"}
            $width="all-spacing-7"
            $background="transparent"
            $position="absolute"
            $ba="border-solid-m"
            $borderColor="grey60"
            $borderRadius="border-radius-circle"
          />
        )}
      </OakFlex>
      {theme.label}
    </RadioButtonLabel>
  );
};
