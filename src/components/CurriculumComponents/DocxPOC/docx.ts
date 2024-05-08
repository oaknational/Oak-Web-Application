import JSZip from "jszip";
import { Element, js2xml, xml2js } from "xml-js";

const toXml = (jsonObj: Element): string => {
  const output = js2xml(jsonObj);
  return output;
};

function toJson(xmlData: string) {
  return xml2js(xmlData, {
    compact: false,
    captureSpacesBetweenElements: false,
  });
}

export async function modifyXmlBySelector(
  data: ArrayBuffer,
  selector: string,
  handler: (current: Element) => Promise<Element>,
) {
  const zipContent = await JSZip.loadAsync(data);

  for (const [key, value] of Object.entries(zipContent.files)) {
    if (!key.endsWith(".xml") && !key.endsWith(".rels")) {
      continue;
    }

    const json = toJson(await value.async("text"));

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
        zipContent.file(key, toXml(newJson));
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

export async function findAsJson(
  data: ArrayBuffer,
  selector: string,
  handler: (current: Element) => boolean = () => true,
) {
  const zipContent = await JSZip.loadAsync(data);

  for (const [key, value] of Object.entries(zipContent.files)) {
    console.log({ key, value });
    if (!key.endsWith(".xml") && !key.endsWith(".rels")) {
      continue;
    }

    const json = toJson(await value.async("text"));
    console.log(json.elements.map((el: Element) => el.name));

    if (json.elements) {
      const docIndex = json.elements.findIndex(
        (el: Element) => el.name === selector,
      );
      if (docIndex > -1) {
        console.log("HERE/", docIndex);
        if (handler(json.elements![docIndex]!)) {
          return json;
        }
      }
    }
  }
}

export async function findAnyReplaceByName(
  parent: Element,
  selector: string,
  fn: (el: Element) => Promise<Element>,
) {
  if (parent.elements) {
    const index = parent.elements.findIndex((el) => el.name === selector);
    if (index > -1) {
      const newElements = [...parent.elements];
      newElements[index] = await fn(parent.elements[index]!);
      const newParent = {
        ...parent,
        elements: newElements,
      };
      return newParent;
    } else {
      return parent;
    }
  } else {
    return parent;
  }
}

export const elementContains = (
  root: Element,
  fn: (el: Element, parent?: Element) => boolean,
  parent?: Element,
): boolean => {
  if (fn(root, parent)) {
    console.log(">>> found!");
    return true;
  }
  if (root.elements) {
    for (const element of root.elements) {
      if (elementContains(element, fn, root)) {
        console.log(">> found!");
        return true;
      }
    }
  }
  return false;
};

const elementMapperRun = async (
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
        return elementMapperRun(el, fn, root);
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

export const elementMapper = async (
  root: Element,
  fn: (el: Element, parent?: Element) => Promise<Element | undefined>,
): Promise<Element | undefined> => {
  return elementMapperRun(root, fn)!;
};
