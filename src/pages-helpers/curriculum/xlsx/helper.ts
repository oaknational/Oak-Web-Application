import { JSZipCached } from "../docx/docx";

export function createXmlIndexMap<T extends Record<string, string>>(def: T) {
  const indexMap: Record<keyof typeof def, string> = {} as Record<
    keyof typeof def,
    string
  >;
  const xml = Object.entries(def)
    .map(([key, xml], index) => {
      indexMap[key as keyof typeof def] = String(index);
      return xml;
    })
    .join("\n");

  return {
    xml,
    indexMap,
  };
}

export function addOrUpdateSheet(
  zip: JSZipCached,
  sheetNumber: number,
  xml: string,
) {
  zip.writeString(
    `xl/worksheets/sheet${sheetNumber}.xml`,
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${xml}`,
  );
}
