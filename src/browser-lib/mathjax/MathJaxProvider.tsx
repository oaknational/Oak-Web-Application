"use client";
import React, { PropsWithChildren } from "react";
import { MathJaxContext } from "better-react-mathjax";

const MathJaxProvider = ({ children }: PropsWithChildren) => (
  <MathJaxContext src={"/mathjax/tex-chtml.js"}>{children}</MathJaxContext>
);

export { MathJaxProvider };
