import { OakSpan, OakSpanProps } from "@oaknational/oak-components";

import { ColorProps } from "@/styles/utils/color";

const TAG_COLOR_MAP = {
  lavender: {
    background: "lavender30",
    borderColor: "lavender50",
  },
  pink: {
    background: "pink30",
    borderColor: "pink50",
  },
  aqua: {
    background: "aqua30",
    borderColor: "aqua50",
  },
  mint: {
    background: "mint30",
    borderColor: "mint50",
  },
  lemon: {
    background: "lemon30",
    borderColor: "lemon50",
  },
  grey: {
    background: "grey30",
    borderColor: "grey40",
  },
} as const;

export type TagColor = keyof typeof TAG_COLOR_MAP;
type TagFunctionalProps = OakSpanProps &
  ColorProps & {
    text: string;
    color: TagColor;
  };

export function TagFunctional({ text, ...styleProps }: TagFunctionalProps) {
  const { background, borderColor } = TAG_COLOR_MAP[styleProps.color];
  return (
    <OakSpan
      $background={background}
      $borderColor={borderColor}
      $borderRadius="border-radius-s"
      $ba="border-solid-s"
      $pv="spacing-4"
      $ph="spacing-8"
      $font="heading-light-7"
      {...styleProps}
      $color={"grey70"}
    >
      {text}
    </OakSpan>
  );
}
