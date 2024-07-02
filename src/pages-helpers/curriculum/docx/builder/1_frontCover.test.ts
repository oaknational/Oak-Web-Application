import { generateEmptyDocx } from "../docx";
import { zipToSimpleObject } from "../zip";

import generate from "./1_frontCover";

import { CombinedCurriculumData } from "@/pages/teachers/curriculum/docx-poc/[...slugs]";

describe("1_frontCover", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "",
        phaseTitle: "",
        examboardTitle: "",
      } as CombinedCurriculumData,
    });

    expect(zipToSimpleObject(zip)).toMatchSnapshot();
  });
});
