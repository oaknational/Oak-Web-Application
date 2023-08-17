import React, { FC, useEffect } from "react";

import { Span } from "../Typography";

const MathJaxWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // @ts-expect-error - no types for MathJax
    if (typeof window?.MathJax !== "undefined") {
      // @ts-expect-error - typeset() is used for dynamic pages
      window.MathJax.typeset();
    }
  }, []);

  //suppressHydrationWarning - Unhandled Runtime Error without this as MathJax is rendering on the client and text content does not match server-rendered HTML.
  return <Span suppressHydrationWarning>{children}</Span>;
};

export default MathJaxWrapper;
