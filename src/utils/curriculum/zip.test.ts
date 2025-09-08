import JSZip from "jszip";

import { zipFromFiles } from "./zip";

describe("zipFromFiles", () => {
  test("zipFromFiles() with no files should error", () => {
    expect(zipFromFiles([])).rejects.toEqual(
      new Error("Must provide at least one file"),
    );
  });

  test("zipFromFiles() with files should create zip", async () => {
    const fileSpy = jest.spyOn(JSZip.prototype, "file");
    const fooBuffer = new Uint8Array(1);
    const barBuffer = new Uint8Array(1);
    const output = await zipFromFiles([
      {
        filename: "foo",
        buffer: fooBuffer,
      },
      {
        filename: "bar",
        buffer: barBuffer,
      },
    ]);
    expect(fileSpy).toHaveBeenCalledWith("foo", fooBuffer);
    expect(fileSpy).toHaveBeenCalledWith("bar", barBuffer);
    expect(Buffer.isBuffer(output));
  });
});
