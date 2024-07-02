import { generateEmptyDocx } from "../docx";
import { zipToSimpleObject } from "../zip";

import generate from "./3_ourCurriculum";

describe("3_ourCurriculum", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip);

    expect(zipToSimpleObject(zip)).toMatchSnapshot();
  });
});
