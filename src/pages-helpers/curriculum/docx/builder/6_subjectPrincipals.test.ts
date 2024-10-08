import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./6_subjectPrincipals";
import { zipToSnapshotObject } from "./helper";

describe("6_subjectPrincipals", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectPrinciples: ["one", "two", "three", "four", "five"],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
