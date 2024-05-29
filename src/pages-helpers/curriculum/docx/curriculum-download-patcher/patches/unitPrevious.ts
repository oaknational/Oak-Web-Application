import type { Element } from "xml-js";

import { UnitLike, textIncludes, textReplacer } from "./util";

export function unitPreviousPatch(unit: UnitLike) {
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
