import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./7_ourPartner";
import { zipToSnapshotObject } from "./helper";

// From <https://stackoverflow.com/a/9967193>
const EMPTY_PNG =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

describe("7_ourPartner", () => {
  it("without partner image", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        curriculumPartnerOverviews: [{ curriculumPartner: {}, partnerBio: "" }],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("renders with one partner from curriculum partner overview", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        partnerBio: "testing",
        curriculumPartnerOverviews: [
          {
            curriculumPartner: {
              image: {
                asset: {
                  url: EMPTY_PNG,
                },
              },
            },
            partnerBioPortableTextRaw: [
              {
                style: "normal",
                _type: "block",
                children: [
                  {
                    _type: "span",
                    marks: [],
                    text: "Example partnet bio text",
                  },
                ],
              },
            ],
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("renders multiple curriculum partners (portabletext) from curriculum partner overview", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        partnerBio: "testing",
        curriculumPartnerOverviews: [
          {
            curriculumPartner: {
              image: {
                asset: {
                  url: EMPTY_PNG,
                },
              },
            },
            partnerBio: "PARTNER_1",
            partnerBioPortableTextRaw: [
              {
                style: "normal",
                _type: "block",
                children: [
                  {
                    _type: "span",
                    marks: [],
                    text: "Example partnet bio text 1",
                  },
                ],
              },
            ],
          },
          {
            curriculumPartner: {
              image: {
                asset: {
                  url: EMPTY_PNG,
                },
              },
            },
            partnerBio: "PARTNER_2",
            partnerBioPortableTextRaw: [
              {
                style: "normal",
                _type: "block",
                children: [
                  {
                    _type: "span",
                    marks: [],
                    text: "Example partnet bio text 2",
                  },
                ],
              },
            ],
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("renders multiple curriculum partners (non-portabletext) from curriculum partner overview", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        partnerBio: "testing",
        curriculumPartnerOverviews: [
          {
            curriculumPartner: {
              image: {
                asset: {
                  url: EMPTY_PNG,
                },
              },
            },
            partnerBio: "PARTNER_1",
            partnerBioPortableTextRaw: null,
          },
          {
            curriculumPartner: {
              image: {
                asset: {
                  url: EMPTY_PNG,
                },
              },
            },
            partnerBio: "PARTNER_2",
            partnerBioPortableTextRaw: null,
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
