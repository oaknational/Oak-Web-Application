import { ReactNode } from "react";

import Box from "../Box";
import { Span } from "../Typography";

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
    <Box $mt={4} $mb={withoutMarginBottom ? 0 : 24}>
      <Span
        $color="failure"
        $font={variant === "large" ? "body-5" : "body-3"}
        id={id}
      >
        {children}
      </Span>
    </Box>
  );
};

export default FieldError;
