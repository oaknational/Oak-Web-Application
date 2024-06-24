import { CombinedCurriculumData } from "..";

import { partnerNamePatch } from "./partnerName";

describe("partnerName", () => {
  it("should modify node if present", async () => {
    const patcher = partnerNamePatch({
      curriculumPartner: {
        name: "TESTING_NAME",
      },
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: "testing {{=PARTNER_NAME}} a node",
    });

    expect(node).toEqual({
      type: "cdata",
      cdata: "testing TESTING_NAME a node",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = await partnerNamePatch({
      curriculumPartner: {
        name: "TESTING_NAME",
      },
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: "testing {{=FOOBAR}} a node",
    });

    expect(node).toEqual({
      type: "text",
      text: "testing {{=FOOBAR}} a node",
    });
  });
});
