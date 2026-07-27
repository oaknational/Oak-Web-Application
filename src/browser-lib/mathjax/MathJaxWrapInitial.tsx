"use client";
import { MathJax } from "better-react-mathjax";
import React from "react";

/**
 * Wraps content that contains math to be transformed using Mathjax
 * Only math provided to the initial render will be typeset; if the math content is expected to
 * change and will need to be re-typeset use the `dynamic` flag on the Mathjax wrapper
 */
export const MathJaxWrapInitial = ({
  children,
  inline,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) => {
  return (
    <MathJax hideUntilTypeset="first" inline={inline}>
      {children}
    </MathJax>
  );
};
