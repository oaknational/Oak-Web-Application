import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./7_ourPartner";
import { zipToSnapshotObject } from "./helper";

// From <https://stackoverflow.com/a/9967193>
const EMPTY_PNG =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

describe("7_ourPartner", () => {
  it.skip("with partner image", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        curriculumPartnerOverviews: [
          {
            curriculumPartner: {
              image: {
                asset: {
                  url: EMPTY_PNG,
                },
              },
            },
            partnerBio: "testing",
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("without partner image", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        curriculumPartnerOverviews: [{ partnerBio: "" }],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
