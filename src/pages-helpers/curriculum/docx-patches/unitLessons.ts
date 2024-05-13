import type { Element } from "xml-js";

import { CombinedCurriculumData } from "../../../pages/teachers/curriculum/docx-poc/[...slugs]";

import { textIncludes, textReplacer } from "./util";

export function unitLessonsPatch(
  unit: CombinedCurriculumData["units"][number],
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.LESSONS}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=UNIT.LESSONS}}",
          unit.lessons?.map((l) => l.title).join(", ") ?? "",
        ),
      } as Element;
    }
    return el;
  };
}
