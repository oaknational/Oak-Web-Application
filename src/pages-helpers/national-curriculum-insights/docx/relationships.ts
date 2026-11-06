import type { Element } from "xml-js";

import { insightsDocumentLink } from "./tracking";

import type { JSZipCached } from "@/pages-helpers/curriculum/docx/docx";

export const writeInsightsDocxRelationships = (
  zip: JSZipCached,
  path: string,
  relationships: Element,
) => {
  const root = relationships.elements?.[0];
  for (const relationship of root?.elements ?? []) {
    const target = relationship.attributes?.Target;
    if (typeof target === "string") {
      const href =
        relationship.attributes?.Type ===
          "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" &&
        URL.canParse(target)
          ? insightsDocumentLink(new URL(target))
          : target;
      relationship.attributes!.Target = href
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    }
  }
  zip.writeJson(path, relationships);
};
