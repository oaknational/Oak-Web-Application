import { generateEmptyDocx } from "../docx";

import generate from "./3_ourCurriculum";
import { zipToSnapshotObject } from "./helper";

describe("3_ourCurriculum", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip);

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
