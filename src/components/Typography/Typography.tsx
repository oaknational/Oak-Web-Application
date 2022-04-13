import React, { FC } from "react";
import clsx from "clsx";

import styles from "../../styles/Typography.module.css";

// Defining the HTML tag that the component will support
const variantsMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  h7: "h7",
  body1: "p",
  body2: "p",
  body3: "p",
  body4: "p",
};

type variantsType = keyof typeof variantsMapping;

type TypographyProps = {
  variant: variantsType;
  className?: string;
};

const Text: FC<TypographyProps> = ({ variant, children, ...props }) => {
  const Component = variant
    ? (variantsMapping[variant] as keyof JSX.IntrinsicElements)
    : ("p" as keyof JSX.IntrinsicElements);

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
