import { generateEmptyDocx } from "../../docx";
import { zipToSimpleObject } from "../../zip";

import generate from "./8_units";
import { data, slugs } from "./8_units.fixture";

describe("8_units", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      slugs: slugs,
      data: data,
    });

    expect(zipToSimpleObject(zip.getJsZip())).toMatchSnapshot();
  });
});
