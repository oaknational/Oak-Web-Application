"use client";
import React, { PropsWithChildren } from "react";
import { MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/unicode"] },
  tex: {
    packages: { "[+]": ["unicode"] },
    unicode: ["unicode"],
  },
};

const MathJaxProvider = ({ children }: PropsWithChildren) => (
  <MathJaxContext src={"/mathjax/tex-chtml.js"} config={config}>
    {children}
  </MathJaxContext>
);

export { MathJaxProvider };
