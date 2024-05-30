import { CombinedCurriculumData } from "..";

import { backPatch } from "./back";

describe("back", () => {
  it("should modify node if present", async () => {
    const patcher = backPatch({
      curriculumPartner: {
        name: "TESTING_PARTNER",
      },
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: "testing {{=BACK.PARTNER_NAME}} a node",
    });

    expect(node).toEqual({
      type: "cdata",
      cdata: "testing TESTING_PARTNER a node",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = await backPatch({
      curriculumPartner: {
        name: "TESTING_PARTNER",
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
