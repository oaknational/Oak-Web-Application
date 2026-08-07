"use client";
import React, { PropsWithChildren } from "react";
import { MathJaxContext } from "better-react-mathjax";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const config = {
  loader: { load: ["[tex]/unicode"] },
  tex: {
    packages: { "[+]": ["unicode"] },
  },
};

const MathJaxProvider = ({ children }: PropsWithChildren) => {
  const reportError = errorReporter("mathjax");
  return (
    <MathJaxContext
      src={"/mathjax/tex-chtml.js"}
      config={config}
      onError={(e) =>
        reportError(new OakError({ code: "mathjax/startup", originalError: e }))
      }
    >
      {children}
    </MathJaxContext>
  );
};

export { MathJaxProvider };
