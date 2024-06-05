import { CombinedCurriculumData } from "..";

import { subjectPatch } from "./subject";

describe("subject", () => {
  it("should modify node if present", async () => {
    const patcher = subjectPatch({
      subjectTitle: "TESTING_NAME",
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: "testing {{=SUBJECT}} a node",
    });

    expect(node).toEqual({
      type: "cdata",
      cdata: "testing TESTING_NAME a node",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = await subjectPatch({
      subjectTitle: "TESTING_NAME",
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
