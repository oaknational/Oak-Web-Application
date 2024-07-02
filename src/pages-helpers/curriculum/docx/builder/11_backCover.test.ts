import { generateEmptyDocx } from "../docx";
import { zipToSimpleObject } from "../zip";

import generate from "./11_backCover";

import { CombinedCurriculumData } from "@/pages/teachers/curriculum/docx-poc/[...slugs]";

describe("11_backCover", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        partnerBio: "testing",
        curriculumPartner: {
          name: "Acme Corp",
        },
      } as CombinedCurriculumData,
    });

    expect(zipToSimpleObject(zip)).toMatchSnapshot();
  });
});
