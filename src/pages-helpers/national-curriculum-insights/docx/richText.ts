import { cdata, safeXml } from "@ooxml-tools/xml";
import type { Element } from "xml-js";

import { writeInsightsDocxRelationships } from "./relationships";
import { insightsDocumentLink } from "./tracking";

import {
  generateHash,
  insertNumbering,
  type JSZipCached,
} from "@/pages-helpers/curriculum/docx/docx";
import { xmlElementToJson } from "@/pages-helpers/curriculum/docx/xml";
import { internalLinkEntrySchema } from "@/common-lib/cms-types/base";
import { resolveInternalHref } from "@/utils/portableText/resolveInternalHref";

type MarkDefinition = {
  _key?: string;
  _type?: string;
  href?: string;
  anchor?: string;
  reference?: unknown;
};

type Span = { text?: string; marks?: string[] };
type Block = {
  _type?: string;
  children?: Span[];
  markDefs?: MarkDefinition[];
  style?: string;
  listItem?: string;
  level?: number;
};

type WordList = { kind: string; id: string };

const getParagraphStyle = (style: string | undefined, fallback?: string) => {
  if (style === "h2" || style === "heading2") return "Heading3";
  if (style === "h3" || style === "heading3") return "Heading4";
  return fallback;
};

export type ParagraphOptions = {
  style?: string;
  runStyle?: string;
  properties?: string;
  size?: number;
  bold?: boolean;
  keepNext?: boolean;
  before?: number;
  after?: number;
  prefix?: string;
};

const textLines = (text: string) =>
  text
    .split(/\r\n|\r|\n/)
    .map((line) => safeXml`<w:t xml:space="preserve">${cdata(line)}</w:t>`)
    .join("<w:br />");

export const wordText = (
  text: string,
  {
    bold = false,
    size,
    runStyle,
  }: { bold?: boolean; size?: number; runStyle?: string } = {},
) => safeXml`
  <w:r>
    <w:rPr>
      ${runStyle ? safeXml`<w:rStyle w:val="${runStyle}" />` : ""}
      ${bold ? safeXml`<w:b />` : ""}
      ${size ? safeXml`<w:sz w:val="${size * 2}" />` : ""}
    </w:rPr>
    ${textLines(text)}
  </w:r>
`;

export const wordParagraph = (
  content: string,
  options: ParagraphOptions = {},
) => safeXml`
  <w:p>
    ${options.properties ||
    safeXml`
      <w:pPr>
        ${options.style ? safeXml`<w:pStyle w:val="${options.style}" />` : ""}
        ${options.keepNext ? safeXml`<w:keepNext />` : ""}
        <w:widowControl />
        <w:spacing
          w:before="${options.before ?? 0}"
          w:after="${options.after ?? 160}"
          w:line="336"
          w:lineRule="auto"
        />
      </w:pPr>
    `}
    ${options.prefix ?? ""}${content}
  </w:p>
`;

const listDefinition = (kind: string) => safeXml`
  <XML_FRAGMENT>
    <w:multiLevelType w:val="multilevel" />
    ${Array.from(
      { length: 9 },
      (_, level) => safeXml`
        <w:lvl w:ilvl="${level}">
          <w:start w:val="1" />
          <w:numFmt w:val="${kind === "number" ? "decimal" : "bullet"}" />
          <w:lvlText w:val="${kind === "number" ? `%${level + 1}.` : "•"}" />
          <w:lvlJc w:val="left" />
          <w:pPr>
            <w:ind w:left="${500 + level * 500}" w:hanging="300" />
          </w:pPr>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" />
          </w:rPr>
        </w:lvl>
      `,
    )}
  </XML_FRAGMENT>
`;

export const createInsightsDocxRichText = (
  zip: JSZipCached,
  pageUrl: string,
) => {
  const links: Record<string, string> = {};

  const link = (href: string | undefined, content: string): string => {
    if (!href) return content;
    let url: URL;
    try {
      url = new URL(href, pageUrl);
    } catch {
      return content;
    }
    if (!["https:", "http:", "mailto:"].includes(url.protocol)) return content;
    const target = insightsDocumentLink(url);
    const key = generateHash(target);
    links[key] = target;
    return safeXml`<w:hyperlink r:id="rId${key}">${content}</w:hyperlink>`;
  };

  const markHref = (definition: MarkDefinition): string | undefined => {
    if (definition._type === "link") return definition.href;
    if (definition._type === "anchor" && definition.anchor) {
      return `#${definition.anchor}`;
    }
    if (definition._type === "internalLink") {
      const reference = definition.reference;
      const input =
        reference &&
        typeof reference === "object" &&
        "slug" in reference &&
        typeof reference.slug === "string"
          ? { ...reference, slug: { current: reference.slug } }
          : reference;
      const parsed = internalLinkEntrySchema.safeParse(input);
      if (parsed.success) return resolveInternalHref(parsed.data);
    }
    return undefined;
  };

  const spanXml = (span: Span, block: Block, options: ParagraphOptions) => {
    const marks = Array.isArray(span.marks) ? span.marks : [];
    const definition = block.markDefs?.find(
      (candidate) => candidate._key && marks.includes(candidate._key),
    );
    const href = definition ? markHref(definition) : undefined;
    const text = typeof span.text === "string" ? span.text : "";
    const run = safeXml`
      <w:r>
        <w:rPr>
          ${options.runStyle
            ? safeXml`<w:rStyle w:val="${options.runStyle}" />`
            : ""}
          ${options.bold || marks.includes("strong") ? safeXml`<w:b />` : ""}
          ${marks.includes("em") ? safeXml`<w:i />` : ""}
          ${marks.includes("underline") || href
            ? safeXml`<w:u w:val="single" />`
            : ""}
          ${marks.includes("strike-through") ? safeXml`<w:strike />` : ""}
          ${options.size ? safeXml`<w:sz w:val="${options.size * 2}" />` : ""}
        </w:rPr>
        ${textLines(text)}
      </w:r>
    `;
    return link(href, run);
  };

  const listProperties = async (
    block: Block,
    lists: Map<number, WordList>,
    fallback?: string,
  ): Promise<string | undefined> => {
    if (!block.listItem) {
      lists.clear();
      return fallback;
    }
    const kind = ["number", "numbering"].includes(block.listItem)
      ? "number"
      : "bullet";
    const level = Math.min(8, Math.max(0, (block.level ?? 1) - 1));
    for (const depth of lists.keys()) {
      if (depth > level) lists.delete(depth);
    }
    let list = lists.get(level);
    if (list?.kind !== kind) {
      const ids = await insertNumbering(zip, {
        list: listDefinition(kind),
      });
      const numbering = await zip.readJson("word/numbering.xml");
      const instance = numbering.elements[0].elements.find(
        (element: Element) =>
          element.name === "w:num" &&
          element.attributes?.["w:numId"] === ids.list,
      );
      instance.elements.push(
        xmlElementToJson(safeXml`
          <w:lvlOverride w:ilvl="${level}">
            <w:startOverride w:val="1" />
          </w:lvlOverride>
        `),
      );
      zip.writeJson("word/numbering.xml", numbering as Element);
      list = { kind, id: ids.list };
      lists.set(level, list);
    }
    return safeXml`
      <w:pPr>
        <w:pStyle w:val="ListParagraph" />
        <w:numPr>
          <w:ilvl w:val="${level}" />
          <w:numId w:val="${list.id}" />
        </w:numPr>
        <w:widowControl />
        <w:spacing w:after="100" w:line="336" w:lineRule="auto" />
      </w:pPr>
    `;
  };

  const render = async (
    value: unknown,
    options: ParagraphOptions & {
      lastParagraphOptions?: ParagraphOptions;
    } = {},
  ): Promise<string> => {
    if (!Array.isArray(value)) return "";
    const lists = new Map<number, WordList>();
    const blocks = (value as Block[]).filter(
      (block) =>
        block &&
        (!block._type || block._type === "block") &&
        Array.isArray(block.children),
    );
    return blocks.reduce(async (previous, block, index) => {
      const output = await previous;
      const paragraphOptions = {
        ...options,
        ...(index === blocks.length - 1 ? options.lastParagraphOptions : {}),
      };
      const content = block
        .children!.map((span) => spanXml(span, block, paragraphOptions))
        .join("");
      const properties = await listProperties(
        block,
        lists,
        paragraphOptions.properties,
      );
      const style = getParagraphStyle(block.style, paragraphOptions.style);
      const paragraph = wordParagraph(content, {
        ...paragraphOptions,
        style,
        properties,
        prefix: index === 0 ? options.prefix : undefined,
      });
      return output + paragraph;
    }, Promise.resolve(""));
  };

  return {
    render,
    link,
    finish: async () => {
      const path = "word/_rels/document.xml.rels";
      const relationships = await zip.readJson(path);
      const elements = relationships.elements[0].elements;
      const ids = new Set(
        elements.map(
          (element: { attributes?: { Id?: string } }) => element.attributes?.Id,
        ),
      );
      for (const [key, target] of Object.entries(links)) {
        const id = `rId${key}`;
        if (ids.has(id)) continue;
        elements.push({
          type: "element",
          name: "Relationship",
          attributes: {
            Id: id,
            Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
            Target: target,
            TargetMode: "External",
          },
        });
      }
      writeInsightsDocxRelationships(zip, path, relationships as Element);
    },
  };
};
