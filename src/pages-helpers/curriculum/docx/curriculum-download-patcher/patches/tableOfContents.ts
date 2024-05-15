import type { Element } from "xml-js";

import { textIncludes, textReplacer } from "./util";

export function tableOfContentsPatch() {
  return async (el: Element) => {
    if (el.type === "text" && textIncludes(el.text, "{{=TABLE_OF_CONTENTS}}")) {
      return {
        type: "text",
        text: textReplacer(el.text, "{{=TABLE_OF_CONTENTS}}", "TODO"),
      };
    }
    return el;
  };
}
