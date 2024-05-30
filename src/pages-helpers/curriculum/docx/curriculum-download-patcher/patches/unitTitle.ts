import type { Element } from "xml-js";

import { cdataJson } from "../../xml";

import { UnitLike, textIncludes, textReplacer } from "./util";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

export function unitTitlePatch(
  unit: UnitLike,
  unit_options?: Unit["unit_options"],
  unitOptionIndex?: number,
) {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=UNIT.TITLE}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(
          el.text,
          "{{=UNIT.TITLE}}",
          unitOptionIndex !== undefined &&
            unit_options &&
            unitOptionIndex in unit_options
            ? `${unit.title}/${unit_options[unitOptionIndex]!.title}: Option ${
                unitOptionIndex + 1
              }`
            : unit.title,
        ),
      });
    }
    return el;
  };
}
