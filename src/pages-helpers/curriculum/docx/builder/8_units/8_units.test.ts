import { generateEmptyDocx } from "../../docx";
import { zipToSnapshotObject } from "../helper";

import generate from "./8_units";
import { data } from "./8_units.fixture";

describe("8_units", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      slugs: {
        subjectSlug: "science",
        phaseSlug: "primary",
      },
      data: data,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("subjectcategory grouped", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      slugs: {
        subjectSlug: "english",
        phaseSlug: "secondary",
        keyStageSlug: "secondary",
        ks4OptionSlug: "aqa",
      },
      data: data,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
