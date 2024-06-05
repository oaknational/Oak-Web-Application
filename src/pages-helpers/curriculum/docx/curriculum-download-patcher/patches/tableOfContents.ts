import type { Element } from "xml-js";

import { cdataJson } from "../../xml";

import { textIncludes, textReplacer } from "./util";

export function tableOfContentsPatch() {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=TABLE_OF_CONTENTS}}")) {
      return cdataJson({
        type: "text",
        text: textReplacer(el.text, "{{=TABLE_OF_CONTENTS}}", "TODO"),
      });
    }
    return el;
  };
}
