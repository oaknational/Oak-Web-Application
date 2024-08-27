import { CombinedCurriculumData, Slugs } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./1_frontCover";
import { zipToSnapshotObject } from "./helper";

describe("1_frontCover", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "",
        phaseTitle: "",
        examboardTitle: "",
      } as CombinedCurriculumData,
      slugs: {
        subjectSlug: "",
      } as Slugs,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
