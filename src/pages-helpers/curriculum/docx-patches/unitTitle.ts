import type { Element } from "xml-js";

import { CombinedCurriculumData } from "../../../pages/teachers/curriculum/docx-poc/[...slugs]";

import { textIncludes, textReplacer } from "./util";

export function unitTitlePatch(unit: CombinedCurriculumData["units"][number]) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.TITLE}}")) {
      return {
        type: "text",
        text: textReplacer(el.text, "{{=UNIT.TITLE}}", unit.title),
      } as Element;
    }
    return el;
  };
}
