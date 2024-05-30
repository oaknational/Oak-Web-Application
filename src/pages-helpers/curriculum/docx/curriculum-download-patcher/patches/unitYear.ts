import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";
import { cdataJson } from "../../xml";

import { textIncludes, textReplacer } from "./util";

export function unitYearPatch(unit: CombinedCurriculumData["units"][number]) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.YEAR}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(el.text, "{{=UNIT.YEAR}}", unit.year),
      });
    }
    return el;
  };
}
