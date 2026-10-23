import type { Element } from "xml-js";

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
      relationship.attributes!.Target = target
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    }
  }
  zip.writeJson(path, relationships);
};
