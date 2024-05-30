import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";

import { textIncludes, textReplacer } from "./util";

export function threadOverviewTitlePatch(
  combinedCurriculumData: CombinedCurriculumData,
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=THREADS.TITLE}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=THREADS.TITLE}}",
          `${combinedCurriculumData.phaseTitle.toLowerCase()} ${
            combinedCurriculumData.subjectTitle
          }`,
        ),
      };
    }
    return el;
  };
}
