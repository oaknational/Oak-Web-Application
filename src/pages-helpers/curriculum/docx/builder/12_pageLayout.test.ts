import { generateEmptyDocx } from "../docx";

import generate from "./12_pageLayout";
import { zipToSnapshotObject } from "./helper";

describe("12_pageLayout", () => {
  it("section", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      margins: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
        header: 10,
        footer: 10,
      },
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("isLast", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      isLast: true,
      margins: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
        header: 10,
        footer: 10,
      },
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
