import { MouseEventHandler, useRef } from "react";

import errorReporter from "../common-lib/error-reporter";
import OakError from "../errors/OakError";

const reportError = errorReporter("useClickableCard");

const getInteractiveAncestor = (
  target: Element | ParentNode
): Element | ParentNode | undefined => {
  if (["BUTTON", "A"].includes(target.nodeName)) {
    return target;
  }

  if (!target.parentNode) {
    return;
  }

  return getInteractiveAncestor(target.parentNode);
};

/**
 * For creating a clickable card. Returns 'primaryTargetProps' and
 * 'containerProps'.
 * {primaryTargetProps} should be spread on the primary link or button of the
 * clikable card.
 * {containerProps} should be spread on the container (the card itself).
 *
 * **Note: any secondary button or link callbacks should call
 * e.stopPropagation()**
 */
const useClickableCard = <
  T extends HTMLAnchorElement | HTMLButtonElement
>() => {
  const ref = useRef<T>(null);
  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target instanceof Element) {
      const interactiveAncestor = getInteractiveAncestor(e.target);
      if (interactiveAncestor) {
        return;
      }
    }
    if (!ref.current) {
      const error = new OakError({ code: "misc/unexpected-type" });
      reportError(error, {
        hint: "A card has been clicked, and an inner target ref was expected, but is missing",
      });
      return;
    }
    const selectedText = window.getSelection()?.toString();
    if (!selectedText) {
      ref.current.click();
    }
  };

  return {
    primaryTargetProps: { ref },
    containerProps: { onClick },
  };
};

export default useClickableCard;
