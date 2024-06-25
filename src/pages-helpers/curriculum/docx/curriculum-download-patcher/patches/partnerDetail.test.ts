import { CombinedCurriculumData } from "..";

import { partnerDetailPatch } from "./partnerDetail";

describe("partnerDetail", () => {
  it("should modify node if present", async () => {
    const patcher = partnerDetailPatch({
      partnerBio: "TESTING_DETAIL",
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: "testing {{=PARTNER_DETAIL}} a node",
    });

    expect(node).toEqual({
      type: "cdata",
      cdata: "testing TESTING_DETAIL a node",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = await partnerDetailPatch({
      partnerBio: "TESTING_PARTNER",
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
