import type { Element } from "xml-js";

import { cdataJson } from "../../xml";

import { UnitLike, textIncludes, textReplacer } from "./util";

export function unitNextPatch(unit: UnitLike) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.NEXT}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(
          el.text,
          "{{=UNIT.NEXT}}",
          unit.connection_future_unit_description
            ? unit.connection_future_unit_description
            : "-",
        ),
      });
    }
    return el;
  };
}
