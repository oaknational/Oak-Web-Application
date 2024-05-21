import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";

import { textIncludes, textReplacer } from "./util";

export function backPatch(combinedCurriculumData: CombinedCurriculumData) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=BACK.PARTNER_NAME}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=BACK.PARTNER_NAME}}",
          combinedCurriculumData.curriculumPartner.name,
        ),
      };
    }
    return el;
  };
}
