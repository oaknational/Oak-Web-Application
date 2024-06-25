import { CombinedCurriculumData } from "..";

import { subjectExplainerPatch } from "./subjectExplainer";

describe("subjectExplainer", () => {
  it("should modify node if present", async () => {
    const patcher = subjectExplainerPatch({
      curriculaDesc: "TESTING_DESC",
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: "testing {{=SUBJECT_EXPLAINER}} a node",
    });

    expect(node).toEqual({
      type: "cdata",
      cdata: "testing TESTING_DESC a node",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = await subjectExplainerPatch({
      curriculaDesc: "TESTING_DESC",
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
