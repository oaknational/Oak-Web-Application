import { MarginProps } from "@/styles/utils/spacing";
import { Span } from "@/components/Typography";
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
    background: "grey2",
    borderColor: "grey4",
  },
} as const;

export type TagColor = keyof typeof TAG_COLOR_MAP;
type TagFunctionalProps = MarginProps &
  ColorProps & {
    text: string;
    color: TagColor;
  };

export function TagFunctional({ text, ...styleProps }: TagFunctionalProps) {
  const { background, borderColor } = TAG_COLOR_MAP[styleProps.color];
  return (
    <Span
      $background={background}
      $borderColor={borderColor}
      $borderRadius={4}
      $ba={1}
      $pv={4}
      $ph={8}
      $font="heading-light-7"
      {...styleProps}
      $color={"oakGrey5"}
    >
      {text}
    </Span>
  );
}
