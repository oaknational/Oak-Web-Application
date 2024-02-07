import { ReactNode } from "react";
import { OakSpan } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex";
import Icon from "@/components/SharedComponents/Icon";

type FieldErrorVariant = "large";

type FieldErrorProps = {
  id: string;
  children: ReactNode;
  withoutMarginBottom?: boolean;
  variant?: FieldErrorVariant | null;
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
    <Flex
      $mt={4}
      $alignItems={"center"}
      $flexDirection={"row"}
      $mb={withoutMarginBottom ? 0 : 24}
    >
      <Flex $alignSelf={"flex-start"} $mr={4}>
        <Icon name="content-guidance" $color={"red"} />
      </Flex>
      <OakSpan
        $color="red"
        $font={variant === "large" ? ["body-2-bold", "body-1-bold"] : "body-2"}
        id={id}
      >
        {children}
      </OakSpan>
    </Flex>
  );
};

export default FieldError;
