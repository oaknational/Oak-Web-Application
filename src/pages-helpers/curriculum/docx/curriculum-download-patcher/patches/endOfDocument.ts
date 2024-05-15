import type { Element } from "xml-js";

import { checkWithinElement } from "../../docx";

import { textIncludes } from "./util";

export function endOfDocumentPatch() {
  return async (el: Element, parent?: Element) => {
    if (
      parent?.name === "w:body" &&
      checkWithinElement(el, (el: Element) => {
        return (
          el.type === "text" && textIncludes(el.text, "{{=END_OF_DOCUMENT}}")
        );
      })
    ) {
      // This is here so we can hide assets after this marker in the document
      return;
    }
    return el;
  };
}
