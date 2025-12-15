import { OakSpan, OakSpanProps } from "@oaknational/oak-components";

import { ColorProps } from "@/styles/utils/color";

const TAG_COLOR_MAP = {
  lavender: {
    background: "bg-decorative3-very-subdued",
    borderColor: "border-decorative3",
  },
  pink: {
    background: "bg-decorative4-very-subdued",
    borderColor: "border-decorative4",
  },
  aqua: {
    background: "bg-decorative2-very-subdued",
    borderColor: "border-decorative2",
  },
  mint: {
    background: "bg-decorative1-very-subdued",
    borderColor: "border-decorative1",
  },
  lemon: {
    background: "bg-decorative5-very-subdued",
    borderColor: "border-decorative5",
  },
  grey: {
    background: "bg-neutral-stronger",
    borderColor: "border-neutral-lighter",
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
      $color={"text-primary"}
    >
      {text}
    </OakSpan>
  );
}
