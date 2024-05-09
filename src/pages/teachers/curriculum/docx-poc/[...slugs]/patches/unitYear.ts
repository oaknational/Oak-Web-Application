import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";

import { textIncludes, textReplacer } from "./util";

export function unitYearPatch(unit: CombinedCurriculumData["units"][number]) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.YEAR}}")) {
      return {
        type: "text",
        text: textReplacer(el.text, "{{=UNIT.YEAR}}", unit.year),
      } as Element;
    }
    return el;
  };
}
