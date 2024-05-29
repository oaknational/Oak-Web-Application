import type { Element } from "xml-js";

import { UnitLike, textIncludes, textReplacer } from "./util";

export function unitNumberPatch(unit: UnitLike, index: number) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.NUM}}")) {
      return {
        type: "text",
        text: textReplacer(el.text, "{{=UNIT.NUM}}", `${index + 1}.`),
      } as Element;
    }
    return el;
  };
}
