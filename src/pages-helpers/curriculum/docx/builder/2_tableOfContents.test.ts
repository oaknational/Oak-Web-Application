import { generateEmptyDocx } from "../docx";

import generate from "./2_tableOfContents";
import { zipToSnapshotObject } from "./helper";

import { CombinedCurriculumData } from "@/pages/teachers/curriculum/docx-poc/[...slugs]";

describe("2_tableOfContents", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "Science",
        units: [
          { year: "7" },
          { year: "8" },
          { year: "9" },
          { year: "10" },
          { year: "11" },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
