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
      $mt="spacing-4"
      $alignItems={"center"}
      $flexDirection={"row"}
      $mb={withoutMarginBottom ? "spacing-0" : "spacing-24"}
      aria-hidden={props.ariaHidden}
    >
      <OakFlex $alignSelf={"flex-start"} $mr="spacing-4">
        <OakIcon
          iconName="content-guidance"
          $colorFilter={"red"}
          $width={"spacing-24"}
          $height={"spacing-24"}
        />
      </OakFlex>
      <OakSpan
        $color="text-error"
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
