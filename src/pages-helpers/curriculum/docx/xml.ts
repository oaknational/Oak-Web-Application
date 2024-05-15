import { js2xml, xml2js } from "xml-js";
import type { Element } from "xml-js";

export function xmlRootToJson(xmlData: string) {
  return xml2js(xmlData, {
    compact: false,
    captureSpacesBetweenElements: false,
  });
}

export function xmlElementToJson(xmlData: string) {
  const rootNode = xmlRootToJson(xmlData);
  if (rootNode.elements.length !== 1) {
    throw new Error("Expecting a single root node in XML");
  }
  return rootNode.elements[0];
}

export function jsonXmlToXmlString(json: Element): string {
  const root = "declaration" in json ? json : { elements: [json] };
  const output = js2xml(root);
  return output;
}
