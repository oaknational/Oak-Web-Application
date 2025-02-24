"use client";
import {
  OakSecondaryButton,
  OakSecondaryButtonProps,
} from "@oaknational/oak-components";
import { ReactNode, useState } from "react";

const SkipLink = (
  props: Omit<OakSecondaryButtonProps, "element"> & {
    children: ReactNode;
    href: string;
  },
) => {
  const [isFocussed, setIsFocussed] = useState(false);
  const { children, ...buttonProps } = props;

  return (
    <OakSecondaryButton
      {...buttonProps}
      data-testid="skip-link"
      element="a"
      onFocus={() => setIsFocussed(true)}
      onBlur={() => setIsFocussed(false)}
      style={isFocussed ? {} : { position: "absolute", left: "-10000px" }}
    >
      {children}
    </OakSecondaryButton>
  );
};

export default SkipLink;
