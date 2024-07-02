import { extname, join, relative } from "path";
import { readFile, stat } from "fs/promises";
import { createHash } from "crypto";

import { glob } from "glob";
import JSZip from "jszip";
import { json2xml, type Element } from "xml-js";

import { jsonXmlToXmlString, xmlElementToJson, xmlRootToJson } from "./xml";

function generateHash(buffer: Buffer | string) {
  const hash = createHash("sha1");
  hash.setEncoding("hex");
  hash.write(buffer);
  hash.end();
  return hash.read();
}

export async function insertImages<T extends Record<string, string>>(
  zip: JSZip,
  images: T,
) {
  const DOC_RELS = "word/_rels/document.xml.rels";
  const json = xmlRootToJson(await zip.file(DOC_RELS)!.async("text"));

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
          console.log("skipping");
          return null;
        }

        let file: Buffer;
        if (filePathOrUrl.match(/^(https?|data):/)) {
          file = Buffer.from(await (await fetch(filePathOrUrl)).arrayBuffer());
        } else {
          file = await readFile(filePathOrUrl);
        }

        const ext = extname(filePathOrUrl);
        const filepath = `media/hash_${imagePathHash}${ext}`;
        zip.file(join("word", filepath), file);
        return xmlElementToJson(`
                <Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${filepath}"/>
            `);
      },
    ),
  );

  for (const element of elements) {
    if (element) {
      json.elements[0].elements.push(element);
    }
  }

  zip.file(DOC_RELS, jsonXmlToXmlString(json as Element));
  return output;
}

export async function insertLinks<T extends Record<string, string>>(
  zip: JSZip,
  links: T,
) {
  const DOC_RELS = "word/_rels/document.xml.rels";
  const json = xmlRootToJson(await zip.file(DOC_RELS)!.async("text"));

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
      return;
    }
    return xmlElementToJson(`
            <Relationship Id="rId${linkHash}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${url}" TargetMode="External"/>
        `);
  });

  for (const element of elements) {
    if (element) {
      json.elements[0].elements.push(element);
    }
  }

  zip.file(DOC_RELS, jsonXmlToXmlString(json as Element));
  return output;
}

// English Metric Unit (EMU): A measurement in computer typography. There are
// 635 EMUs per twip, 6,350 EMUs per half-point, 12,700 EMUs per point, and
// 914,400 EMUs per inch. These units are used to translate on-screen layouts
// to printed layouts for specified printer hardware.
export function cmToEmu(cm: number) {
  const inches = cm / 2.54;
  return Math.round(inches * 914400);
}

export function wrapInLinkTo(id: string, childXml: string) {
  return `<w:hyperlink r:id="${id}">${childXml}</w:hyperlink>`;
}

export function wrapInLinkToBookmark(anchor: string, childXml: string) {
  return `<w:hyperlink w:anchor="${anchor}">${childXml}</w:hyperlink>`;
}

let bookmarkId = 10000;
export function wrapInBookmarkPoint(anchor: string, childXml: string) {
  bookmarkId++;
  return `
        <w:bookmarkStart w:id="${bookmarkId}" w:name="${anchor}"/>
        ${childXml}
        <w:bookmarkEnd w:id="${bookmarkId}"/>
    `;
}

let IMAGE_ID = 10000;
type ImageOpts = {
  name?: string;
  desc?: string;
  width?: number;
  height?: number;
  isDecorative?: boolean;
};
export function createImage(rId: string, opts: ImageOpts = {}) {
  const uid = IMAGE_ID++;
  const {
    width = 1000000,
    height = 1000000,
    name = "",
    desc = "",
    isDecorative = false,
  } = opts;

  const isDecorativeVal = isDecorative ? 1 : 0;

  return `
        <w:drawing>
            <wp:inline distT="0" distB="0" distL="0" distR="0">
                <wp:extent cx="${width}" cy="${height}"/>
                <wp:effectExtent l="0" t="0" r="0" b="0"/>
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
            </wp:inline>
        </w:drawing>
    `;
}

export async function appendBodyElements(zip: JSZip, childElements: Element[]) {
  const docRaw = await zip.file("word/document.xml")?.async("string");
  if (!docRaw) {
    throw new Error("Missing ./word/document.xml");
  }
  const doc = xmlRootToJson(docRaw);

  if (!doc.elements) {
    throw new Error("expected doc.elements");
  }
  const oldElements = doc.elements[0]!.elements!;
  const oldElementStart = oldElements.slice(0, -1);
  const endElements = oldElements.slice(-1);
  doc.elements[0]!.elements = [
    ...oldElementStart,
    ...childElements,
    ...endElements,
  ];

  zip.file("word/document.xml", json2xml(JSON.stringify(doc)));
}

function notUndefined<TValue>(value: TValue | undefined): value is TValue {
  return value !== undefined;
}

export async function modifyZipXmlByRootSelector(
  zipContent: JSZip,
  selector: string,
  handler: (current: Element) => Promise<Element>,
) {
  for (const [key, value] of Object.entries(zipContent.files)) {
    if (!key.endsWith(".xml") && !key.endsWith(".rels")) {
      continue;
    }

    const json = xmlRootToJson(await value.async("text"));

    if (json.elements) {
      const docIndex = json.elements.findIndex(
        (el: Element) => el.name === selector,
      );
      if (docIndex > -1) {
        // Modify
        const newElements = [...json.elements];
        newElements[docIndex] = await handler(json.elements![docIndex]!);
        const newJson = {
          ...json,
          elements: newElements,
        } as Element;
        zipContent.file(key, jsonXmlToXmlString(newJson));
      }
    }
  }
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

export async function generateEmptyDocx() {
  const basedir = join(
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

  return zip;
}
