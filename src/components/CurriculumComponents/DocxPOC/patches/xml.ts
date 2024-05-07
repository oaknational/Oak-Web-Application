import { xml2js } from "xml-js";

export function xmlElementsToJson(xmlData: string) {
  return xml2js(xmlData, {
    compact: false,
    captureSpacesBetweenElements: false,
  });
}

export function xmlElementToJson(xmlData: string) {
  return xmlElementsToJson(xmlData).elements[0];
}
