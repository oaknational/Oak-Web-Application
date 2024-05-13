import type { Element } from "xml-js";

import { CombinedCurriculumData } from "../../../pages/teachers/curriculum/docx-poc/[...slugs]";

import { textIncludes, textReplacer } from "./util";

export function partnerNamePatch(
  combinedCurriculumData: CombinedCurriculumData,
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=PARTNER_NAME}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=PARTNER_NAME}}",
          combinedCurriculumData.curriculumPartner.name,
        ),
      };
    }
    return el;
  };
}
