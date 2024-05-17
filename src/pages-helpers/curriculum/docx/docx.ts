import JSZip from "jszip";
import type { Element } from "xml-js";

import { collapseFragments, jsonXmlToXmlString, xmlRootToJson } from "./xml";
import {
  notUndefined,
  textIncludes,
} from "./curriculum-download-patcher/patches/util";

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

  return zipContent.generateAsync({
    type: "uint8array",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
  });
}

export function hasStartBlock(element: Element, selector: string) {
  return checkWithinElement(element, (el: Element) => {
    return (
      el.type === "text" && textIncludes(el.text, `{{BLOCK_START.${selector}}}`)
    );
  });
}

export function hasEndBlock(element: Element, selector: string) {
  return checkWithinElement(element, (el: Element) => {
    return (
      el.type === "text" && textIncludes(el.text, `{{BLOCK_END.${selector}}}`)
    );
  });
}

export async function withBlock(
  el: Element,
  selector: string,
  fn: (element: Element) => Promise<Element | undefined>,
) {
  const blockElement: Element = {
    type: "element",
    name: "$FRAGMENT$",
    elements: [],
  };
  blockElement.elements = [];

  const rootIndex = el.elements?.findIndex((el) => el.name === "w:body") ?? -1;
  if (rootIndex > -1 && el.elements) {
    const root = el.elements[rootIndex];

    let startIndex = -1;
    let endIndex = -1;

    if (root && root.elements) {
      for (let index = 0; index < (root.elements ?? []).length; index++) {
        const element = root.elements[index]!;
        if (startIndex === -1 && hasStartBlock(element, selector)) {
          startIndex = index;
        } else if (startIndex > -1 && hasEndBlock(element, selector)) {
          endIndex = index;
          break;
        } else if (startIndex > -1) {
          blockElement.elements.push(element);
        }
      }

      if (startIndex > -1 && endIndex > -1) {
        const newBlockElement = await fn(blockElement);

        const newEl = { ...el, elements: [...el.elements] };
        const newRoot = { ...root, elements: [...root.elements] };

        if (newBlockElement) {
          newRoot.elements.splice(
            startIndex,
            endIndex - startIndex + 1,
            newBlockElement,
          );
        } else {
          newRoot.elements.splice(startIndex, endIndex - startIndex + 1);
        }

        const newRootCollapsed = newRoot;
        newEl.elements[rootIndex] = newRootCollapsed;
        return collapseFragments(newEl);
      }
    }
  }
  return el;
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
