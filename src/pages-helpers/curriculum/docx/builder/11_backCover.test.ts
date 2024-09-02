import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./11_backCover";
import { zipToSnapshotObject } from "./helper";

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

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
