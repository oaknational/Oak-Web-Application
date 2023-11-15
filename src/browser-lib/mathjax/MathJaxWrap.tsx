"use client";
import { MathJax } from "better-react-mathjax";
import React from "react";

const MathJaxWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <MathJax hideUntilTypeset="every" dynamic>
      {children}
    </MathJax>
  );
};

export { MathJaxWrap };
