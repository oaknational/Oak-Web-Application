import JSZip from "jszip";

export type OutputFile = {
  filename: string;
  buffer: Uint8Array;
};

export async function zipFromFiles(files: OutputFile[]) {
  const zip = new JSZip();
  for (const { filename, buffer } of files) {
    zip.file(filename, buffer);
  }
  const uArray = await zip.generateAsync({ type: "uint8array" });
  return Buffer.from(uArray);
}
