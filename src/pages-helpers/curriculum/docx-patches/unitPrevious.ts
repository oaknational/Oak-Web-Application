import type { Element } from "xml-js";

import { CombinedCurriculumData } from "../../../pages/teachers/curriculum/docx-poc/[...slugs]";

import { textIncludes, textReplacer } from "./util";

export function unitPreviousPatch(
  unit: CombinedCurriculumData["units"][number],
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.PREVIOUS}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=UNIT.PREVIOUS}}",
          unit.connection_prior_unit_description ?? "-",
        ),
      } as Element;
    }
    return el;
  };
}
