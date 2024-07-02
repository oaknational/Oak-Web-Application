import { generateEmptyDocx } from "../docx";
import { zipToSimpleObject } from "../zip";

import generate from "./5_subjectExplainer";

import { CombinedCurriculumData } from "@/pages/teachers/curriculum/docx-poc/[...slugs]";

describe("5_tableOfContents", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        curriculaDesc: "Something\nsomething\nsomething",
        subjectTitle: "Science",
      } as CombinedCurriculumData,
    });

    expect(zipToSimpleObject(zip)).toMatchSnapshot();
  });
});
