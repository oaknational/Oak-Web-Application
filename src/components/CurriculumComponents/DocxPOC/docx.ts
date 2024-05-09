import JSZip from "jszip";
import type { Element } from "xml-js";

import { jsonXmlToXmlString, xmlElementsToJson } from "./patches/xml";

/**
 * Modify docx file
 */
export async function modifyXmlByRootSelector(
  docxFile: ArrayBuffer,
  selector: string,
  handler: (current: Element) => Promise<Element>,
) {
  const zipContent = await JSZip.loadAsync(docxFile);

  for (const [key, value] of Object.entries(zipContent.files)) {
    if (!key.endsWith(".xml") && !key.endsWith(".rels")) {
      continue;
    }

    const json = xmlElementsToJson(await value.async("text"));

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

  return zipContent.generateAsync({
    type: "uint8array",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
  });
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

    let newElements: Element[] | undefined;
    if (newRoot.elements) {
      const newElementsSparse = await Promise.all(
        newRoot.elements.map(async (el) => {
          return runner(el, fn, root);
        }),
      );
      newElements = newElementsSparse.filter(
        (el) => el !== undefined,
      ) as Element[];
    }

    return {
      ...newRoot,
      elements: newElements,
    };
  };

  return runner(root, fn)!;
}

export async function pipeElementThrough(
  root: Element,
  parent: Element | undefined,
  fns: ((node: Element, parent?: Element) => Promise<Element | undefined>)[],
) {
  let current: Element | undefined = root;
  for await (const fn of fns) {
    if (current) {
      current = await fn(current, parent);
    } else {
      return;
    }
  }
  return current;
}
