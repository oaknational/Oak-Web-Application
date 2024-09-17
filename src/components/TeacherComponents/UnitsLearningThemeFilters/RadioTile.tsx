import styled from "styled-components";

import {
  OakBox,
  OakBoxProps,
  OakFlex,
  OakLabel,
  OakLabelProps,
} from "@/styles/oakThemeApp";

// TODO: extract to components lib
const RadioTileLabel = styled(OakLabel)<OakLabelProps>`
  cursor: pointer;
  display: flex;
  gap: 8px;
`;

const HiddenRadioButtonInput = styled.input.attrs({
  type: "radio",
})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const RadioTileFocus = styled(OakBox)<OakBoxProps>`
  box-shadow: ${`inset 0 0 0 0.15rem #ffe555`};
  width: calc(100% + 12px);
  height: calc(100% + 12px);
  top: -6px;
  left: -6px;
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

export const RadioTile = ({
  theme,
  isChecked,
  isFocussed,
  onChange,
  onFocus,
  id,
}: {
  theme: RadioTheme;
  isChecked: boolean;
  isFocussed: boolean;
  id: string;
  onChange: (theme: RadioTheme) => void;
  onFocus: (value: string | undefined) => void;
}) => {
  return (
    <OakBox
      $borderColor="border-neutral"
      $ba="border-solid-m"
      $borderRadius="border-radius-s"
      $pa="inner-padding-s"
      key={theme.slug}
      $position={"relative"}
      $background={isFocussed || isChecked ? "black" : "transparent"}
      $color={isFocussed || isChecked ? "white" : "black"}
    >
      {isFocussed && (
        <RadioTileFocus
          $background="transparent"
          $position="absolute"
          $ba="border-solid-l"
          $borderColor="grey60"
          $borderRadius="border-radius-s"
        />
      )}

      <RadioTileLabel htmlFor={id}>
        <HiddenRadioButtonInput
          value={theme.slug}
          id={id}
          checked={isChecked}
          onChange={() => onChange(theme)}
          tabIndex={0}
          onFocus={() => onFocus(theme.slug)}
          onBlur={() => onFocus(undefined)}
        />
        <OakFlex
          $height={"all-spacing-6"}
          $width="all-spacing-6"
          $borderColor="border-neutral"
          $flexGrow={0}
          $flexShrink={0}
          $alignItems={"center"}
          $justifyContent={"center"}
          $background={"bg-primary"}
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
        </OakFlex>
        {theme.label}
      </RadioTileLabel>
    </OakBox>
  );
};
