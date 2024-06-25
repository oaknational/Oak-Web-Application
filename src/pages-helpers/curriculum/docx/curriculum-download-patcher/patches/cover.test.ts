import { CombinedCurriculumData } from "..";

import { coverPatch } from "./cover";

describe("coverPatch", () => {
  it("should modify node for KS1-2", async () => {
    const patcher = coverPatch({
      phaseTitle: "Primary",
      subjectTitle: "Maths",
    } as CombinedCurriculumData);

    const keyStageNode = await patcher({
      type: "text",
      text: " {{=COVER.KEY_STAGE}} ",
    });

    expect(keyStageNode).toEqual({
      type: "cdata",
      cdata: " KS1 & KS2 ",
    });

    const subjectNode = await patcher({
      type: "text",
      text: " {{=COVER.SUBJECT}} ",
    });

    expect(subjectNode).toEqual({
      type: "cdata",
      cdata: " Maths  ",
    });
  });

  it("should modify node for KS1-2", async () => {
    const patcher = coverPatch({
      phaseTitle: "Secondary",
      subjectTitle: "Science",
      examboardTitle: "AQA",
    } as CombinedCurriculumData);

    const keyStageNode = await patcher({
      type: "text",
      text: " {{=COVER.KEY_STAGE}} ",
    });

    expect(keyStageNode).toEqual({
      type: "cdata",
      cdata: " KS3 & KS4 ",
    });

    const subjectNode = await patcher({
      type: "text",
      text: " {{=COVER.SUBJECT}} ",
    });

    expect(subjectNode).toEqual({
      type: "cdata",
      cdata: " Science  ",
    });

    const examboardNode = await patcher({
      type: "text",
      text: " {{=COVER.EXAM_BOARD}} ",
    });

    expect(examboardNode).toEqual({
      type: "cdata",
      cdata: " AQA (KS4) ",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = coverPatch({
      phaseTitle: "Secondary",
      subjectTitle: "Science",
    } as CombinedCurriculumData);

    const node = await patcher({
      type: "text",
      text: " {{=FOOBAR}} ",
    });

    expect(node).toEqual({
      type: "text",
      text: " {{=FOOBAR}} ",
    });
  });
});
