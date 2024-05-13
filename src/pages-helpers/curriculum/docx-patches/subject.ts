import type { Element } from "xml-js";

import { CombinedCurriculumData } from "../../../pages/teachers/curriculum/docx-poc/[...slugs]";

import { textIncludes, textReplacer } from "./util";

export function subjectPatch(combinedCurriculumData: CombinedCurriculumData) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=SUBJECT}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=SUBJECT}}",
          `${combinedCurriculumData.phaseTitle} ${combinedCurriculumData.subjectTitle}`,
        ),
      };
    }
    return el;
  };
}
