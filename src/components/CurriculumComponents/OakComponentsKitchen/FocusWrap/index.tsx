import React, { useEffect, useRef } from "react";

import { getAllTabFocusableElements } from "@/utils/curriculum/dom";

export type FocusWrapEvent = {
  target: Node;
  container: Node;
};

export type FocusWrapProps = {
  children: React.ReactNode;
  onWrapStart?: (event: FocusWrapEvent) => void;
  onWrapEnd?: (event: FocusWrapEvent) => void;
};
export default function FocusWrap({
  children,
  onWrapStart,
  onWrapEnd,
}: Readonly<FocusWrapProps>) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      let potentialWrapStart = false;
      let potentialWrapEnd = false;

      const focusInHandler = (e: { target: EventTarget | null }) => {
        if (e.target) {
          const target = e.target as Node;
          if (!el.contains(target)) {
            const container = el;
            const returnEvent = { container, target };
            if (potentialWrapStart) {
              onWrapStart?.(returnEvent);
            }
            if (potentialWrapEnd) {
              onWrapEnd?.(returnEvent);
            }
          }
        }

        potentialWrapStart = false;
        potentialWrapEnd = false;
      };
      const focusOutHandler = (e: { target: EventTarget | null }) => {
        if (e.target) {
          const target = e.target as Node;
          if (el.contains(target)) {
            const lastFocusOutElement = e.target;
            const elements = getAllTabFocusableElements(el);
            const lastFocusOutElementIndex = elements.findIndex(
              (el) => el === lastFocusOutElement,
            );
            const isOutFirst = lastFocusOutElementIndex === 0;
            const isOutLast = lastFocusOutElementIndex === elements.length - 1;

            potentialWrapStart = false;
            potentialWrapEnd = false;
            if (isOutLast) {
              potentialWrapEnd = true;
            } else if (isOutFirst) {
              potentialWrapStart = true;
            }
          } else {
            potentialWrapStart = false;
            potentialWrapEnd = false;
          }
        }
      };

      const focusHandler = () => {
        focusInHandler({ target: document.body });
      };

      document.addEventListener("focusin", focusInHandler);
      document.addEventListener("focusout", focusOutHandler);

      // This event handler is required because focusin events don't occur on the window
      window.addEventListener("focus", focusHandler);

      return () => {
        document.removeEventListener("focusin", focusInHandler);
        document.removeEventListener("focusout", focusOutHandler);
        window.removeEventListener("focus", focusHandler);
      };
    }
  }, [ref, onWrapStart, onWrapEnd]);

  return <div ref={ref}>{children}</div>;
}
