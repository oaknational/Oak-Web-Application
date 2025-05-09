import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./2_tableOfContents";
import { zipToSnapshotObject } from "./helper";

describe("2_tableOfContents", () => {
  it("without pathways", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "Physical education",
        units: [
          { year: "7", threads: [] },
          { year: "8", threads: [] },
          { year: "9", threads: [] },
          { year: "10", threads: [] },
          { year: "11", threads: [] },
        ],
      } as unknown as CombinedCurriculumData,
      ks4Options: [],
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("with pathways", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "Physical education",
        units: [
          { year: "7", threads: [] },
          { year: "8", threads: [] },
          { year: "9", threads: [] },
          { year: "10", threads: [], pathway: "core" },
          { year: "11", threads: [], pathway: "core" },
          { year: "10", threads: [], pathway: "gcse" },
          { year: "11", threads: [], pathway: "gcse" },
        ],
      } as unknown as CombinedCurriculumData,
      ks4Options: [
        { slug: "core", title: "Core" },
        { slug: "gcse", title: "GCSE" },
      ],
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
