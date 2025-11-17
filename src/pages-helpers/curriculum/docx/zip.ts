import NodeBuffer, { Buffer } from "node:buffer";

import JSZip from "jszip";
import { ElementCompact, Element, json2xml } from "xml-js";

import { xmlRootToJson } from "./xml";
import { generateHash } from "./docx";

type zipToSimpleObjectOpts = {
  convertXmlToJson?: boolean;
  hashBuffers?: boolean;
};
export async function zipToSimpleObject(
  zip: JSZip,
  opts: zipToSimpleObjectOpts = {},
) {
  const output: Record<string, Buffer | string | Element | ElementCompact> = {};
  for (const file of Object.values(zip.files)) {
    const buffer = await file.async("nodebuffer");
    if (NodeBuffer.isUtf8(buffer)) {
      const content = buffer.toString();
      if (content.startsWith(`<?xml version="1.0"`)) {
        if (opts.convertXmlToJson) {
          output[file.name] = xmlRootToJson(content);
        } else {
          output[file.name] = json2xml(
            JSON.stringify(xmlRootToJson(content) as Element),
            {
              spaces: 2,
              compact: false,
              indentText: true,
              fullTagEmptyElement: true,
              indentAttributes: true,
            },
          );
        }
      } else {
        output[file.name] = content;
      }
    } else if (opts.hashBuffers) {
      output[file.name] = generateHash(buffer);
    } else {
      output[file.name] = buffer;
    }
  }
  return output;
}
