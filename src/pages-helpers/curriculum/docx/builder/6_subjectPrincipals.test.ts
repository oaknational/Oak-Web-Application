import { generateEmptyDocx } from "../docx";
import { zipToSimpleObject } from "../zip";

import generate from "./6_subjectPrincipals";

import { CombinedCurriculumData } from "@/pages/teachers/curriculum/docx-poc/[...slugs]";

describe("6_subjectPrincipals", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectPrinciples: ["one", "two", "three", "four", "five"],
      } as CombinedCurriculumData,
    });

    expect(zipToSimpleObject(zip)).toMatchSnapshot();
  });
});
