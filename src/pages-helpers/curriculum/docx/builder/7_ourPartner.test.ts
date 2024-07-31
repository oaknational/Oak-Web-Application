import { generateEmptyDocx } from "../docx";

import generate from "./7_ourPartner";
import { zipToSnapshotObject } from "./helper";

import { CombinedCurriculumData } from "@/pages/teachers/curriculum/docx-poc/[...slugs]";

// From <https://stackoverflow.com/a/9967193>
const EMPTY_PNG =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

describe("7_ourPartner", () => {
  it.skip("with partner image", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        partnerBio: "testing",
        curriculumPartner: {
          image: {
            asset: {
              url: EMPTY_PNG,
            },
          },
        },
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("without partner image", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        partnerBio: "testing",
        curriculumPartner: {},
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
