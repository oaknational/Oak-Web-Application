import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";
import { cdataJson } from "../../xml";

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
      return cdataJson({
        type: "text",
        text: textReplacer(
          el.text,
          "{{=COVER.KEY_STAGE}}",
          keyStageFromPhaseTitle(combinedCurriculumData.phaseTitle),
        ),
      });
    }
    if (el.type === "text" && textIncludes(el.text, "{{=COVER.SUBJECT}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(
          el.text,
          "{{=COVER.SUBJECT}}",
          `${combinedCurriculumData.subjectTitle} `,
        ),
      });
    }
    if (el.type === "text" && textIncludes(el.text, "{{=COVER.EXAM_BOARD}}")) {
      const text = combinedCurriculumData.examboardTitle
        ? `${combinedCurriculumData.examboardTitle} (KS4)`
        : "";
      return cdataJson({
        type: "text",
        text: textReplacer(el.text, "{{=COVER.EXAM_BOARD}}", text),
      });
    }

    return el;
  };
}
