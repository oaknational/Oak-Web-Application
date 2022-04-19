import React, { FC } from "react";
import clsx from "clsx";

import styles from "../../styles/Typography.module.css";

// Defining the HTML tag that the component will support
type variantsType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "body3"
  | "body4";

const variantsMapping: Record<variantsType, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  body3: "p",
  body4: "p",
};

type TypographyProps = {
  variant: variantsType;
  className?: string;
};

const Text: FC<TypographyProps> = ({ variant, children, ...props }) => {
  const Component = variantsMapping[variant];

  return (
    <Component
      className={clsx(styles[`typography--variant-${variant}`])}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
