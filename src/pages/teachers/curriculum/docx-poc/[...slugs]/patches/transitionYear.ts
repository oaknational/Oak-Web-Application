import type { Element } from "xml-js";

import { textIncludes, textReplacer } from "./util";

export function transitionYearPatch() {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{TRANSITION_YEAR}}")) {
      return {
        type: "text",
        text: textReplacer(el.text, "{{TRANSITION_YEAR}}", "TODO"),
      };
    }
    return el;
  };
}
