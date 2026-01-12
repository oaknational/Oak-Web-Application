/* istanbul ignore file */
"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

// https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
export default function StyledComponentsRegistry({
  children,
  nonce,
}: Readonly<{
  children: React.ReactNode;
  nonce?: string;
}>) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();

    // Apply nonce to style elements if available
    if (nonce && Array.isArray(styles)) {
      return (
        <>
          {styles.map((element, index) =>
            element
              ? {
                  ...element,
                  props: { ...element.props, nonce, key: index },
                }
              : null,
          )}
        </>
      );
    }

    return <>{styles}</>;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
