import JSZip from "jszip";

export type OutputFile = {
  filename: string;
  buffer: Uint8Array;
};

export async function zipFromFiles(files: OutputFile[]) {
  if (files.length < 1) {
    throw new Error("Must provide at least one file");
  }
  const zip = new JSZip();
  for (const { filename, buffer } of files) {
    zip.file(filename, buffer);
  }
  const uArray = await zip.generateAsync({ type: "uint8array" });
  return Buffer.from(uArray);
}
