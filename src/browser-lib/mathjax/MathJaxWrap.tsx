"use client";
import { MathJax } from "better-react-mathjax";
import React from "react";

const MathJaxWrap = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === "undefined") {
    return children;
  } else {
    return (
      <MathJax hideUntilTypeset="every" dynamic>
        {children}
      </MathJax>
    );
  }
};

export { MathJaxWrap };
