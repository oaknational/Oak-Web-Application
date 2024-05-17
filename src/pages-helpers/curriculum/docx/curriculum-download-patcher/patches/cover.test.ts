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
      type: "text",
      text: " KS1 & KS2 ",
    });

    const subjectNode = await patcher({
      type: "text",
      text: " {{=COVER.SUBJECT}} ",
    });

    expect(subjectNode).toEqual({
      type: "text",
      text: " Maths  ",
    });
  });

  it("should modify node for KS1-2", async () => {
    const patcher = coverPatch({
      phaseTitle: "Secondary",
      subjectTitle: "Science",
    } as CombinedCurriculumData);

    const keyStageNode = await patcher({
      type: "text",
      text: " {{=COVER.KEY_STAGE}} ",
    });

    expect(keyStageNode).toEqual({
      type: "text",
      text: " KS3 & KS4 ",
    });

    const subjectNode = await patcher({
      type: "text",
      text: " {{=COVER.SUBJECT}} ",
    });

    expect(subjectNode).toEqual({
      type: "text",
      text: " Science  ",
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
