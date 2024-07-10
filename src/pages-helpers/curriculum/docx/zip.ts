import NodeBuffer, { Buffer } from "node:buffer";

import JSZip from "jszip";
import { ElementCompact, Element } from "xml-js";

import { xmlRootToJson } from "./xml";

type zipToSimpleObjectOpts = { convertXmlToJson?: true };
export async function zipToSimpleObject(
  zip: JSZip,
  opts: zipToSimpleObjectOpts = {},
) {
  const output: Record<string, Buffer | string | Element | ElementCompact> = {};
  for await (const file of Object.values(zip.files)) {
    const buffer = await file.async("nodebuffer");
    if (NodeBuffer.isUtf8(buffer)) {
      const content = buffer.toString();
      if (opts.convertXmlToJson && content.startsWith(`<?xml version="1.0"`)) {
        output[file.name] = xmlRootToJson(content);
      } else {
        output[file.name] = content;
      }
    } else {
      output[file.name] = buffer;
    }
  }
  return output;
}
