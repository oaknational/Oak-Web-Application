import { js2xml, xml2js } from "xml-js";
import type { Element } from "xml-js";

export function xmlElementsToJson(xmlData: string) {
  return xml2js(xmlData, {
    compact: false,
    captureSpacesBetweenElements: false,
  });
}

export function xmlElementToJson(xmlData: string) {
  return xmlElementsToJson(xmlData).elements[0];
}

export function jsonXmlToXmlString(json: Element): string {
  const output = js2xml(json);
  return output;
}
