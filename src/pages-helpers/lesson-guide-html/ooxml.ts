import { xml2js, type Element } from "xml-js";

/**
 * Parses OOXML into xml-js elements.
 *
 * Whitespace-only text has to be kept: Word stores the space between two
 * differently formatted runs as `<w:t xml:space="preserve"> </w:t>`, which
 * xml-js (and so `asXmlElement` from @ooxml-tools/xml) drops by default.
 */
export function parseXml(xml: string): Element {
  return xml2js(xml, {
    compact: false,
    captureSpacesBetweenElements: true,
  }) as Element;
}

export function childElements(node: Element | undefined, name?: string) {
  return (node?.elements ?? []).filter(
    (el) => el.type === "element" && (name === undefined || el.name === name),
  );
}

export function child(node: Element | undefined, name: string) {
  return childElements(node, name)[0];
}

export function findDescendant(
  node: Element | undefined,
  predicate: (el: Element) => boolean,
): Element | undefined {
  for (const el of childElements(node)) {
    if (predicate(el)) return el;
    const found = findDescendant(el, predicate);
    if (found) return found;
  }
  return undefined;
}

export function attr(node: Element | undefined, name: string) {
  const value = node?.attributes?.[name];
  return value === undefined ? undefined : String(value);
}

export function numberAttr(node: Element | undefined, name: string) {
  const value = Number.parseFloat(attr(node, name) ?? "");
  return Number.isFinite(value) ? value : undefined;
}

/** Toggle properties: `<w:b/>` and `<w:b w:val="1"/>` are on, `w:val="0"` is off. */
export function isOn(node: Element | undefined) {
  if (!node) return false;
  const value = attr(node, "w:val");
  return value === undefined || !["0", "false", "off"].includes(value);
}

/** Concatenated `w:t` text, for messages about links and images. */
export function textOf(node: Element | undefined): string {
  return childElements(node)
    .map((el) =>
      el.name === "w:t"
        ? (el.elements ?? []).map((text) => String(text.text ?? "")).join("")
        : textOf(el),
    )
    .join("");
}

export type Relationship = {
  target: string;
  type: string;
  external: boolean;
};

/** Parses `word/_rels/document.xml.rels`, which maps `r:id`s to link and image targets. */
export function parseRelationships(xml?: string) {
  const relationships = new Map<string, Relationship>();
  if (!xml) return relationships;
  const root = child(parseXml(xml), "Relationships");
  for (const rel of childElements(root, "Relationship")) {
    const id = attr(rel, "Id");
    const target = attr(rel, "Target");
    if (!id || target === undefined) continue;
    relationships.set(id, {
      target,
      type: attr(rel, "Type") ?? "",
      external: attr(rel, "TargetMode") === "External",
    });
  }
  return relationships;
}

/** Whether a list level is numbered (true) or bulleted (false); undefined when unknown. */
export type NumberingLookup = (
  numId: string,
  level: number,
) => boolean | undefined;

/** Parses `word/numbering.xml`, which says whether each list is numbered or bulleted. */
export function parseNumbering(xml?: string): NumberingLookup {
  if (!xml) return () => undefined;
  const root = child(parseXml(xml), "w:numbering");

  const formatsByAbstractId = new Map<string, Map<number, string>>();
  for (const abstractNum of childElements(root, "w:abstractNum")) {
    const formats = new Map<number, string>();
    for (const lvl of childElements(abstractNum, "w:lvl")) {
      formats.set(
        numberAttr(lvl, "w:ilvl") ?? 0,
        attr(child(lvl, "w:numFmt"), "w:val") ?? "decimal",
      );
    }
    formatsByAbstractId.set(
      attr(abstractNum, "w:abstractNumId") ?? "",
      formats,
    );
  }

  const abstractIdByNumId = new Map<string, string>();
  for (const num of childElements(root, "w:num")) {
    abstractIdByNumId.set(
      attr(num, "w:numId") ?? "",
      attr(child(num, "w:abstractNumId"), "w:val") ?? "",
    );
  }

  return (numId, level) => {
    const format = formatsByAbstractId
      .get(abstractIdByNumId.get(numId) ?? "")
      ?.get(level);
    return format === undefined
      ? undefined
      : !["bullet", "none"].includes(format);
  };
}
