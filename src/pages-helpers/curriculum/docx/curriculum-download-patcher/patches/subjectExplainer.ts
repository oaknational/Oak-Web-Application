import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";
import { cdataJson } from "../../xml";

import { textIncludes, textReplacer } from "./util";

export function subjectExplainerPatch(
  combinedCurriculumData: CombinedCurriculumData,
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=SUBJECT_EXPLAINER}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(
          el.text,
          "{{=SUBJECT_EXPLAINER}}",
          combinedCurriculumData.curriculaDesc,
        ),
      });
    }
    return el;
  };
}
