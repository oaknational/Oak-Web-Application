import { extname, join, relative } from "path";
import { readFile, stat } from "fs/promises";
import { createHash } from "crypto";

import { glob } from "glob";
import JSZip from "jszip";
import { ElementCompact, type Element } from "xml-js";

import {
  collapseFragments,
  jsonXmlToXmlString,
  safeXml,
  xmlElementToJson,
  xmlRootToJson,
} from "./xml";

function generateHash(buffer: Buffer | string) {
  const hash = createHash("SHA-256");
  hash.setEncoding("hex");
  hash.write(buffer);
  hash.end();
  return hash.read();
}

let maxId = 10000;
/**
 * Generates a <w:abstractNum/> / <w:num/> pair
 * @param zip docx zip file
 * @param numberingDefinition key / definition rules
 * @returns key / id lookup table
 */
export async function insertNumbering<T extends Record<string, string>>(
  zip: JSZipCached,
  numberingDefinition: T,
) {
  const lookup: Record<keyof typeof numberingDefinition, string> = {} as Record<
    keyof typeof numberingDefinition,
    string
  >;

  const docNumberingPath = "word/numbering.xml";
  const json = await zip.readJson(docNumberingPath);

  json.elements[0].elements = json.elements[0].elements ?? [];

  for (const [key, definition] of Object.entries(numberingDefinition)) {
    const abstractNumId = maxId++;
    const numId = maxId++;
    lookup[key as keyof T] = String(numId);
    json.elements[0].elements.push(
      xmlElementToJson(safeXml`
        <w:abstractNum w:abstractNumId="${abstractNumId}">
          ${definition}
        </w:abstractNum>
      `),
    );

    json.elements[0].elements.push(
      xmlElementToJson(safeXml`
        <w:num w:numId="${numId}">
          <w:abstractNumId w:val="${abstractNumId}" />
        </w:num>
      `),
    );
  }

  zip.writeJson(docNumberingPath, collapseFragments(json as Element));

  return lookup;
}

function extnameWithoutQuery(filepath: string) {
  return extname(filepath).replace(/\?.*$/, "");
}

export async function insertImages<T extends Record<string, string>>(
  zip: JSZipCached,
  images: T,
) {
  const DOC_RELS = "word/_rels/document.xml.rels";
  const json = await zip.readJson(DOC_RELS);

  const existingImageIds = json.elements[0].elements
    .map((element: Element) => element.attributes?.Id)
    .filter(Boolean);

  const output: Record<keyof typeof images, string> = {} as Record<
    keyof typeof images,
    string
  >;
  const elements = await Promise.all(
    Object.entries(images).map(
      async ([key, filePathOrUrl]: [keyof typeof images, string]) => {
        const imagePathHash = generateHash(filePathOrUrl);
        const id = "rId" + imagePathHash;
        output[key] = id;

        if (existingImageIds.includes(id)) {
          return null;
        } else {
          existingImageIds.push(id);
        }

        let ext: string;
        let file: Buffer;
        if (filePathOrUrl.match(/^(data):/)) {
          file = Buffer.from(await (await fetch(filePathOrUrl)).arrayBuffer());
          ext =
            filePathOrUrl.match(/^data:image\/([^;]+);base64/)?.[1] ??
            "unknown";
        } else if (filePathOrUrl.match(/^(https?):/)) {
          const res = await fetch(filePathOrUrl);
          ext =
            "." + res.headers.get("content-type")?.split("/")[1] ?? "unknown";
          file = Buffer.from(await res.arrayBuffer());
          // ext = extnameWithoutQuery(filePathOrUrl);
        } else {
          file = await readFile(filePathOrUrl);
          ext = extnameWithoutQuery(filePathOrUrl);
        }

        const filepath = `media/hash_${imagePathHash}${ext}`;

        zip.writeBinary(join("word", filepath), file);
        return xmlElementToJson(safeXml`
          <Relationship
            Id="${id}"
            Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
            Target="${filepath}"
          />
        `);
      },
    ),
  );

  for (const element of elements) {
    if (element) {
      json.elements[0].elements.push(element);
    }
  }

  zip.writeJson(DOC_RELS, json as Element);
  return output;
}

export async function insertLinks<T extends Record<string, string>>(
  zip: JSZipCached,
  links: T,
) {
  const DOC_RELS = "word/_rels/document.xml.rels";
  const json = await zip.readJson(DOC_RELS);

  const existingIds = json.elements[0].elements
    .map((element: Element) => element.attributes?.Id)
    .filter(Boolean);
  const output: Record<keyof typeof links, string> = {} as Record<
    keyof typeof links,
    string
  >;

  const elements = Object.entries(links).map(([key, url]) => {
    const linkHash = generateHash(url);
    const id = "rId" + linkHash;
    output[key as keyof T] = id;

    if (existingIds.includes(id)) {
      return null;
    } else {
      existingIds.push(id);
    }

    return xmlElementToJson(safeXml`
      <Relationship
        Id="${id}"
        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"
        Target="${url}"
        TargetMode="External"
      />
    `);
  });

  for (const element of elements) {
    if (element) {
      json.elements[0].elements.push(element);
    }
  }

  zip.writeJson(DOC_RELS, json as Element);
  return output;
}

async function addToContentTypesXml(zip: JSZipCached, xml: string) {
  const contentXml = await zip.readJson("[Content_Types].xml");
  contentXml.elements[0].elements.push(xmlElementToJson(xml));
  zip.writeJson("[Content_Types].xml", contentXml as Element);
}

async function insertHeaderFooters<T extends Record<string, string>>(
  type: "header" | "footer",
  zip: JSZipCached,
  content: T,
) {
  const DOC_RELS = "word/_rels/document.xml.rels";
  const json = await zip.readJson(DOC_RELS);

  const existingIds = json.elements[0].elements
    .map((element: Element) => element.attributes?.Id)
    .filter(Boolean);
  const output: Record<keyof typeof content, string> = {} as Record<
    keyof typeof content,
    string
  >;

  const elements = await Promise.all(
    Object.entries(content).map(async ([key, content]) => {
      const contentHash = generateHash(content).slice(0, 12);
      const id = "rId" + contentHash;
      output[key as keyof T] = id;

      if (existingIds.includes(id)) {
        return null;
      } else {
        existingIds.push(id);
      }

      const filepath = `header-${contentHash}.xml`;
      const zipfilepath = `word/${filepath}`;

      await addToContentTypesXml(
        zip,
        safeXml`
          <Override
            PartName="/${zipfilepath}"
            ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml"
          />
        `,
      );

      zip.writeString(zipfilepath, content.trim());

      return xmlElementToJson(`
        <Relationship Id="${id}" Type="http://purl.oclc.org/ooxml/officeDocument/relationships/${type}" Target="${filepath}" />
      `);
    }),
  );

  for (const element of elements) {
    if (element) {
      json.elements[0].elements.push(element);
    }
  }

  zip.writeJson(DOC_RELS, json as Element);
  return output;
}

export async function insertHeaders<T extends Record<string, string>>(
  zip: JSZipCached,
  content: T,
) {
  return insertHeaderFooters("header", zip, content);
}

export async function insertFooters<T extends Record<string, string>>(
  zip: JSZipCached,
  content: T,
) {
  return insertHeaderFooters("footer", zip, content);
}

export function cmToTwip(cm: number) {
  return Math.round(cm * 0.3937007874 * 1440);
}

// English Metric Unit (EMU): A measurement in computer typography. There are
// 635 EMUs per twip, 6,350 EMUs per half-point, 12,700 EMUs per point, and
// 914,400 EMUs per inch. These units are used to translate on-screen layouts
// to printed layouts for specified printer hardware.
export function cmToEmu(cm: number) {
  const inches = cm / 2.54;
  return Math.round(inches * 914400);
}

export function pointToDxa(input: number) {
  return input * 20;
}

export function cmToDxa(cm: number) {
  const inches = cm / 2.54;
  return inches * 72 * 20;
}

export function lineHeight(pointHeight: number, multiplier: number) {
  return Math.round(pointToDxa(pointHeight) * multiplier);
}

export function emuToCm(emu: number) {
  return (emu / 914400) * 2.54;
}

export function createHeader(id: string, type: string) {
  return safeXml`<w:headerReference r:id="${id}" w:type="${type}" />`;
}

export function createFooter(id: string, type: string) {
  return safeXml`<w:footerReference r:id="${id}" w:type="${type}" />`;
}

export function wrapInLinkTo(id: string, childXml: string) {
  return `<w:hyperlink r:id="${id}">${childXml}</w:hyperlink>`;
}

export function wrapInLinkToBookmark(anchor: string, childXml: string) {
  return `<w:hyperlink w:anchor="${anchor}">${childXml}</w:hyperlink>`;
}

export const CURRENT_BOOKMARK = { id: 10000 };
export function wrapInBookmarkPoint(anchor: string, childXml: string) {
  CURRENT_BOOKMARK.id++;
  return `<w:bookmarkStart w:id="${CURRENT_BOOKMARK.id}" w:name="${anchor}"/>${childXml}<w:bookmarkEnd w:id="${CURRENT_BOOKMARK.id}"/>`;
}

let IMAGE_ID = 10000;
type ImageOpts = {
  name?: string;
  desc?: string;
  width?: number;
  height?: number;
  xPos?: number;
  yPos?: number;
  xPosAnchor?: string;
  yPosAnchor?: string;
  isDecorative?: boolean;
  isWrapTight?: boolean;
  relativeHeight?: number;
};
export function createImage(rId: string, opts: ImageOpts = {}) {
  const uid = IMAGE_ID++;
  const {
    width = 1000000,
    height = 1000000,
    name = "",
    desc = "",
    xPos = undefined,
    yPos = undefined,
    xPosAnchor = "page",
    yPosAnchor = "page",
    isDecorative = false,
    isWrapTight = false,
    relativeHeight = 1,
  } = opts;

  const isDecorativeVal = isDecorative ? 1 : 0;

  const wrapInPosition = (xmlString: string) => {
    if (xPos === undefined && yPos === undefined) {
      return `<wp:inline distT="0" distB="0" distL="0" distR="0">${xmlString}</wp:inline>`;
    } else {
      return `<wp:anchor
        distT="0"
        distB="0"
        distL="0"
        distR="114300"
        simplePos="0"
        relativeHeight="${relativeHeight}"
        behindDoc="1"
        locked="0"
        layoutInCell="1"
        allowOverlap="1"
      >
        <wp:simplePos x="0" y="0"/>
        <wp:positionH relativeFrom="${xPosAnchor}">
            <wp:posOffset>${xPos}</wp:posOffset>
        </wp:positionH>
        <wp:positionV relativeFrom="${yPosAnchor}">
            <wp:posOffset>${yPos}</wp:posOffset>
        </wp:positionV>
        ${xmlString}
      </wp:anchor>`;
    }
  };

  return `
        <w:drawing>
            ${wrapInPosition(`
                <wp:extent cx="${width}" cy="${height}"/>
                <wp:effectExtent l="0" t="0" r="0" b="0"/>
                
                ${xPos && !isWrapTight ? "<wp:wrapNone />" : ""}
                ${
                  !isWrapTight
                    ? ""
                    : `
                  <wp:wrapTight wrapText="bothSides">
                    <wp:wrapPolygon edited="0" >
                      <wp:start x="0" y="0" />
                      <wp:lineTo x="0" y="0" />
                      <wp:lineTo x="0" y="0" />
                      <wp:lineTo x="0" y="0" />
                      <wp:lineTo x="0" y="0" />
                      <wp:lineTo x="0" y="0" />
                      <wp:lineTo x="0" y="0" />
                    </wp:wrapPolygon>
                  </wp:wrapTight>
                `
                }
                <wp:docPr id="${uid}" name="${name}" descr="${desc}">
                    <a:extLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                        <a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}">
                            <adec:decorative xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative" val="${isDecorativeVal}"/>
                        </a:ext>
                    </a:extLst>
                </wp:docPr>
                <wp:cNvGraphicFramePr>
                    <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
                </wp:cNvGraphicFramePr>
                <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                    <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                        <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                            <pic:nvPicPr>
                                <pic:cNvPr id="${uid}" name="${name}" descr="${desc}">
                                    <a:extLst>
                                        <a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}">
                                            <adec:decorative xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative" val="${isDecorativeVal}"/>
                                        </a:ext>
                                    </a:extLst>
                                </pic:cNvPr>
                                <pic:cNvPicPr/>
                            </pic:nvPicPr>
                            <pic:blipFill>
                                <a:blip r:embed="${rId}">
                                    <a:extLst>
                                        <a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}">
                                            <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/>
                                        </a:ext>
                                    </a:extLst>
                                </a:blip>
                                <a:stretch>
                                    <a:fillRect/>
                                </a:stretch>
                            </pic:blipFill>
                            <pic:spPr>
                                <a:xfrm>
                                    <a:off x="0" y="0"/>
                                    <a:ext cx="${width}" cy="${height}"/>
                                </a:xfrm>
                                <a:prstGeom prst="rect">
                                    <a:avLst/>
                                </a:prstGeom>
                            </pic:spPr>
                        </pic:pic>
                    </a:graphicData>
                </a:graphic>
            `)}
        </w:drawing>
    `;
}

export async function appendBodyElements(
  zip: JSZipCached,
  childElements: Element[] = [],
) {
  const doc = await zip.readJson("word/document.xml");
  if (!doc) {
    throw new Error("Missing ./word/document.xml");
  }

  const oldElements = doc.elements[0]!.elements![0].elements;
  doc.elements[0]!.elements![0].elements = [...oldElements, ...childElements];

  zip.writeJson("word/document.xml", doc as Element);
}

function notUndefined<TValue>(value: TValue | undefined): value is TValue {
  return value !== undefined;
}

export const checkWithinElement = (
  root: Element,
  fn: (el: Element, parent?: Element) => boolean,
  parent?: Element,
): boolean => {
  if (fn(root, parent)) {
    return true;
  }
  if (root.elements) {
    for (const element of root.elements) {
      if (checkWithinElement(element, fn, root)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Map over all elements from a root node
 */
export async function mapOverElements(
  root: Element,
  fn: (el: Element, parent?: Element) => Promise<Element | undefined>,
): Promise<Element | undefined> {
  const runner = async (
    root: Element,
    fn: (el: Element, parent?: Element) => Promise<Element | undefined>,
    parent?: Element,
  ): Promise<Element | undefined> => {
    const newRoot = await fn(root, parent);

    if (!newRoot) return;

    let hasChanged = false;
    if (newRoot.elements) {
      const newElementsSparse = await Promise.all(
        newRoot.elements.map(async (el) => {
          const moddedEl = await runner(el, fn, newRoot);
          if (moddedEl !== el) {
            hasChanged = true;
          }
          return moddedEl;
        }),
      );

      if (hasChanged) {
        return {
          ...newRoot,
          elements: newElementsSparse.filter(notUndefined),
        };
      }
    }

    return newRoot;
  };

  return runner(root, fn)!;
}

export class JSZipCached {
  public _zip: JSZip;
  private _cache: Record<string, Element | ElementCompact>;
  constructor(zip?: JSZip) {
    this._zip = zip ?? new JSZip();
    this._cache = {};
  }

  async readJson(filename: string) {
    if (this._cache[filename]) {
      return this._cache[filename]!;
    }
    return this._zip
      .file(filename)!
      .async("text")
      .then((res) => {
        const val = xmlRootToJson(res);
        this._cache[filename] = val;
        return val!;
      });
  }

  writeJson(filename: string, content: Element) {
    this._cache[filename] = content;
  }

  readBinary(filename: string) {
    return this._zip.file(filename)!.async("nodebuffer");
  }

  writeBinary(filename: string, content: Buffer) {
    return this._zip.file(filename, content);
  }

  readString(filename: string) {
    return this._zip.file(filename)!.async("string");
  }

  writeString(filename: string, content: string) {
    return this._zip.file(filename, content);
  }

  flush() {
    for (const [filename, content] of Object.entries(this._cache)) {
      this._zip.file(filename, jsonXmlToXmlString(content as Element));
    }
    this._cache = {};
  }

  getJsZip() {
    this.flush();
    return this._zip;
  }

  async zipToBuffer() {
    this.flush();
    return this._zip.generateAsync({
      type: "uint8array",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE",
    });
  }
}

export async function generateEmptyDocx() {
  const basedir = join(
    process.cwd(),
    "./src/pages-helpers/curriculum/docx/empty-document.docx",
  );
  const files = await glob(`${basedir}/**/*`, { dot: true });

  const zip = new JSZip();
  for await (const file of files) {
    const zippath = relative(basedir, file);
    const res = await stat(file);
    if (res.isDirectory()) {
      zip.folder(zippath);
    } else {
      zip.file(zippath, await readFile(file));
    }
  }

  return new JSZipCached(zip);
}
