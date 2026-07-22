"use client";
import { MathJax } from "better-react-mathjax";
import React from "react";

const MathJaxWrap = ({
  children,
  inline,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) => {
  return (
    <MathJax hideUntilTypeset="every" inline={inline}>
      {children}
    </MathJax>
  );
};

export { MathJaxWrap };
