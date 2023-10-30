"use client";
import React, { PropsWithChildren } from "react";
import { MathJaxContext } from "better-react-mathjax";

const MathJaxProvider = ({ children }: PropsWithChildren) => {
  if (typeof window === "undefined") {
    return children;
  } else {
    return (
      <MathJaxContext src={"/mathjax/tex-chtml.js"}>{children}</MathJaxContext>
    );
  }
};

export { MathJaxProvider };
