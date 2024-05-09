import type { Element } from "xml-js";

import { textIncludes, textReplacer } from "./util";

export function yearPatch() {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{YEAR}}")) {
      return {
        type: "text",
        text: textReplacer(el.text, "{{YEAR}}", "TODO"),
      };
    }

    return el;
  };
}
