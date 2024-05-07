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

export async function docToJson(
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
