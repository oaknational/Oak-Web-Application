import { join } from "path";

import { CombinedCurriculumData, Slugs } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./1_frontCover";
import { zipToSnapshotObject } from "./helper";

jest.mock("@/pages-helpers/curriculum/docx/builder/helper", () => ({
  __esModule: true,
  ...jest.requireActual("@/pages-helpers/curriculum/docx/builder/helper"),
  generateIconURL: jest.fn(() =>
    join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/icon.png",
    ),
  ),
}));

describe("1_frontCover", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();

    await generate(zip, {
      data: {
        subjectTitle: "Cooking and nutrition",
        phaseTitle: "Secondary",
        examboardTitle: null,
        units: [{ keystage_slug: "ks3" }],
      } as CombinedCurriculumData,
      slugs: {
        phaseSlug: "secondary",
      } as Slugs,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
