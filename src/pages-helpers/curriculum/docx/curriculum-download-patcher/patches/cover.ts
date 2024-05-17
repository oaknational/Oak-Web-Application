import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";

import { textIncludes, textReplacer } from "./util";

function keyStageFromPhaseTitle(phaseTitle: string) {
  if (phaseTitle === "Primary") {
    return "KS1 & KS2";
  } else if (phaseTitle === "Secondary") {
    return "KS3 & KS4";
  }
  return phaseTitle;
}

export function coverPatch(combinedCurriculumData: CombinedCurriculumData) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=COVER.KEY_STAGE}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=COVER.KEY_STAGE}}",
          keyStageFromPhaseTitle(combinedCurriculumData.phaseTitle),
        ),
      };
    }
    if (el.type === "text" && textIncludes(el.text, "{{=COVER.SUBJECT}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=COVER.SUBJECT}}",
          `${combinedCurriculumData.subjectTitle} `,
        ),
      };
    }

    return el;
  };
}
