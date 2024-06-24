import { ReactNode } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

import Icon from "@/components/SharedComponents/Icon";

type FieldErrorVariant = "large";

type FieldErrorProps = {
  id: string;
  children: ReactNode;
  withoutMarginBottom?: boolean;
  variant?: FieldErrorVariant | null;
  ariaLive?: "off" | "polite" | "assertive";
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
    >
      <OakFlex $alignSelf={"flex-start"} $mr="space-between-sssx">
        <Icon name="content-guidance" $color={"red"} />
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
