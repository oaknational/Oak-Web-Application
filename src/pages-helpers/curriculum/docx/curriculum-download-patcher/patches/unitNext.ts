import type { Element } from "xml-js";

import { UnitLike, textIncludes, textReplacer } from "./util";

export function unitNextPatch(unit: UnitLike) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.NEXT}}")) {
      return {
        type: "text",
        text: textReplacer(
          el.text,
          "{{=UNIT.NEXT}}",
          unit.connection_future_unit_description ?? "-",
        ),
      } as Element;
    }
    return el;
  };
}
