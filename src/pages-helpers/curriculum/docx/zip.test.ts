import JSZip from "jszip";

import { zipToSimpleObject } from "./zip";

describe("zipToSimpleObject", () => {
  it("test", async () => {
    const zip = new JSZip();
    zip.file("foo", "FOO");
    zip.file("bar", "BAR");

    const out = await zipToSimpleObject(zip);
    expect(out).toEqual({
      foo: "FOO",
      bar: "BAR",
    });
  });
});
