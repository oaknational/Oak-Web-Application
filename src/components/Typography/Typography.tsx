import React, { FC } from "react";
import clsx from "clsx";

import styles from "../../styles/Typography.module.css";

export const VARIANTS_TYPE = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body1",
  "body2",
  "body3",
  "body4",
] as const;

export type VariantsType = typeof VARIANTS_TYPE[number];

// // Defining the HTML tag that the component will support
// type VariantsType =
//   | "h1"
//   | "h2"
//   | "h3"
//   | "h4"
//   | "h5"
//   | "h6"
//   | "body1"
//   | "body2"
//   | "body3"
//   | "body4";

const variantsMapping: Record<VariantsType, keyof JSX.IntrinsicElements> = {
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
  semanticVariant: VariantsType;
  styleVariant?: VariantsType;
  className?: string;
};

const Text: FC<TypographyProps> = ({
  semanticVariant,
  styleVariant,
  children,
  ...props
}) => {
  const Component = variantsMapping[semanticVariant];
  const cssVariant = styleVariant || semanticVariant;
  return (
    <Component
      className={clsx(styles[`typography--variant-${cssVariant}`])}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
