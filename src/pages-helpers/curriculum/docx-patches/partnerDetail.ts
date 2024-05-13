import type { Element } from "xml-js";

import { CombinedCurriculumData } from "../../../pages/teachers/curriculum/docx-poc/[...slugs]";

import { textIncludes, textReplacer } from "./util";

export function partnerDetailPatch(
  combinedCurriculumData: CombinedCurriculumData,
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=PARTNER_DETAIL}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=PARTNER_DETAIL}}",
          combinedCurriculumData.partnerBio,
        ),
      };
    }
    return el;
  };
}
