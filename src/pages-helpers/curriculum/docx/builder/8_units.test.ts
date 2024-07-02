import { generateEmptyDocx } from "../docx";
import { zipToSimpleObject } from "../zip";
import { Slugs } from "..";

import generate from "./8_units";

import { CombinedCurriculumData } from "@/pages/teachers/curriculum/docx-poc/[...slugs]";

describe("8_units", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      slugs: {
        examboardSlug: "OCR",
      } as Slugs,
      data: {
        units: [
          { year: "7", title: "Test A" },
          { year: "7", title: "Test B" },
          { year: "8", title: "Test A" },
          { year: "8", title: "Test B" },
          { year: "9", title: "Test A" },
          { year: "9", title: "Test B" },
          { year: "10", title: "Test A" },
          { year: "10", title: "Test B" },
          { year: "11", title: "Test A" },
          { year: "11", title: "Test B" },
        ],
      } as CombinedCurriculumData,
    });

    expect(zipToSimpleObject(zip)).toMatchSnapshot();
  });
});
