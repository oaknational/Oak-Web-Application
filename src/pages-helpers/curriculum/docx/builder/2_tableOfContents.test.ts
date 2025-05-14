import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./2_tableOfContents";
import { zipToSnapshotObject } from "./helper";

import { createUnit } from "@/fixtures/curriculum/unit";

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
          { year: "10", threads: [], pathway: "Core", pathway_slug: "core" },
          { year: "11", threads: [], pathway: "Core", pathway_slug: "core" },
          { year: "10", threads: [], pathway: "GCSE", pathway_slug: "gcse" },
          { year: "11", threads: [], pathway: "GCSE", pathway_slug: "gcse" },
        ],
      } as unknown as CombinedCurriculumData,
      ks4Options: [
        { slug: "core", title: "Core" },
        { slug: "gcse", title: "GCSE" },
      ],
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("with pathways (only core)", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "Physical education",
        units: [
          createUnit({ year: "7", threads: [] }),
          createUnit({ year: "8", threads: [] }),
          createUnit({ year: "9", threads: [] }),
          createUnit({
            year: "10",
            threads: [],
            pathway: "Core",
            pathway_slug: "core",
          }),
          createUnit({
            year: "11",
            threads: [],
            pathway: "Core",
            pathway_slug: "core",
          }),
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
