import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./5_subjectExplainer";
import { zipToSnapshotObject } from "./helper";

describe("5_tableOfContents", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        curriculaDesc: "Something\nsomething\nsomething",
        subjectTitle: "Science",
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
