"use client";
import { MathJax } from "better-react-mathjax";
import React from "react";

/**
 * Wraps content that contains math to be transformed using Mathjax
 * Only math provided to the initial render will be typeset unless the
 * `dynamic` prop is set on the Mathjax wrapper
 */
export const MathJaxWrap = ({
  children,
  inline,
  dynamic,
}: {
  children: React.ReactNode;
  inline?: boolean;
  dynamic?: boolean;
}) => {
  return (
    <MathJax hideUntilTypeset="first" inline={inline} dynamic={dynamic}>
      {children}
    </MathJax>
  );
};
