import type { Element } from "xml-js";

import { CombinedCurriculumData } from "..";

import { textIncludes, textReplacer } from "./util";

export function unitThreadsPatch(
  unit: CombinedCurriculumData["units"][number],
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.THREADS}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=UNIT.THREADS}}",
          unit.threads.map((t) => t.title).join(", "),
        ),
      } as Element;
    }
    return el;
  };
}
