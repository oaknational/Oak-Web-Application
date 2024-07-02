import NodeBuffer, { Buffer } from "node:buffer";

import JSZip from "jszip";

export async function zipToSimpleObject(zip: JSZip) {
  const output: Record<string, Buffer | string> = {};
  for await (const file of Object.values(zip.files)) {
    const buffer = await file.async("nodebuffer");
    if (NodeBuffer.isUtf8(buffer)) {
      output[file.name] = buffer.toString();
    } else {
      output[file.name] = buffer;
    }
  }
  return output;
}
