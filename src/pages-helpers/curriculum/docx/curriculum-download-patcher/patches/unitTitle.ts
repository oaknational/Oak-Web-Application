import type { Element } from "xml-js";

import { UnitLike, textIncludes, textReplacer } from "./util";

export function unitTitlePatch(unit: UnitLike, unitOptionIndex?: number) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.TITLE}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=UNIT.TITLE}}",
          unitOptionIndex !== undefined
            ? `${unit.title}: Option ${unitOptionIndex + 1}`
            : unit.title,
        ),
      } as Element;
    }
    return el;
  };
}
