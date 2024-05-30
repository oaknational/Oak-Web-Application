import type { Element } from "xml-js";

import { cdataJson } from "../../xml";

import { UnitLike, textIncludes, textReplacer } from "./util";

export function unitNumberPatch(unit: UnitLike, index: number) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.NUM}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(el.text, "{{=UNIT.NUM}}", `${index + 1}.`),
      });
    }
    return el;
  };
}
