import { CombinedCurriculumData } from "..";

import { threadOverviewTitlePatch } from "./threadOverviewTitle";

describe("threadsOverviewTitle", () => {
  it("should modify node if present", async () => {
    const patcher = threadOverviewTitlePatch({
      phaseTitle: "PHASE_TITLE",
      subjectTitle: "SUBJECT_TITLE",
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: "testing {{=THREADS.TITLE}} a node",
    });

    expect(node).toEqual({
      type: "cdata",
      cdata: "testing phase_title SUBJECT_TITLE a node",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = await threadOverviewTitlePatch({
      phaseTitle: "PHASE_TITLE",
      subjectTitle: "SUBJECT_TITLE",
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
