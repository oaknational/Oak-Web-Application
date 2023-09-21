import { MarginProps } from "@/styles/utils/spacing";
import { Span } from "@/components/Typography";

type TagFunctionalProps = MarginProps & {
  text: string;
};

export function TagFunctional({ text, ...styleProps }: TagFunctionalProps) {
  return (
    <Span
      $background="aqua30"
      $borderRadius={4}
      $borderColor="aqua50"
      $pa={8}
      $font="heading-light-7"
      {...styleProps}
    >
      {text}
    </Span>
  );
}
