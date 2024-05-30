import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";
import { cdataJson } from "../../xml";

import { textIncludes, textReplacer } from "./util";

export function partnerDetailPatch(
  combinedCurriculumData: CombinedCurriculumData,
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=PARTNER_DETAIL}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(
          el.text,
          "{{=PARTNER_DETAIL}}",
          combinedCurriculumData.partnerBio,
        ),
      });
    }
    return el;
  };
}
