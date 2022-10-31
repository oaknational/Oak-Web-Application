import { ReactNode } from "react";

import Box from "../Box";
import { Span } from "../Typography";

type FieldErrorProps = {
  id: string;
  children: ReactNode;
};

const FieldError = (props: FieldErrorProps) => {
  const { id, children } = props;
  if (!children) {
    /**
     * Return early to avoid unwanted whitespace when there's no error
     */
    return null;
  }
  return (
    <Box $mt={4} $mb={24}>
      <Span $color="failure" $font={"body-3"} id={id}>
        {children}
      </Span>
    </Box>
  );
};

export default FieldError;
