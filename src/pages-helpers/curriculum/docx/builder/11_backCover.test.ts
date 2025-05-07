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
        curriculumPartnerOverviews: [
          { partnerBio: "", curriculumPartner: { name: "Partner1" } },
          { partnerBio: "", curriculumPartner: { name: "Partner2" } },
          { partnerBio: "", curriculumPartner: { name: "Partner3" } },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
