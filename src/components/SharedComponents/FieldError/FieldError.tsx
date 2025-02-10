import { ReactNode } from "react";
import { OakSpan, OakFlex, OakIcon } from "@oaknational/oak-components";

type FieldErrorVariant = "large";

type FieldErrorProps = {
  id: string;
  children: ReactNode;
  withoutMarginBottom?: boolean;
  variant?: FieldErrorVariant | null;
  ariaLive?: "off" | "polite" | "assertive";
  ariaHidden?: boolean;
};

const FieldError = (props: FieldErrorProps) => {
  const { id, children, withoutMarginBottom = false, variant } = props;
  if (!children) {
    /**
     * Return early to avoid unwanted whitespace when there's no error
     */
    return null;
  }
  return (
    <OakFlex
      $mt="space-between-sssx"
      $alignItems={"center"}
      $flexDirection={"row"}
      $mb={withoutMarginBottom ? "space-between-none" : "space-between-m"}
      aria-hidden={props.ariaHidden}
    >
      <OakFlex $alignSelf={"flex-start"} $mr="space-between-sssx">
        <OakIcon
          iconName="content-guidance"
          $colorFilter={"red"}
          $width={"all-spacing-6"}
          $height={"all-spacing-6"}
        />
      </OakFlex>
      <OakSpan
        $color="red"
        $font={variant === "large" ? ["body-2-bold", "body-1-bold"] : "body-2"}
        id={id}
        aria-live={props.ariaLive || "off"}
      >
        {children}
      </OakSpan>
    </OakFlex>
  );
};

export default FieldError;
