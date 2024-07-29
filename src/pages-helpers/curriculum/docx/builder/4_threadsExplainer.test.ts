import { generateEmptyDocx } from "../docx";

import generate from "./4_threadsExplainer";
import { zipToSnapshotObject } from "./helper";

describe("4_threadsExplainer", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      slugs: {
        subjectSlug: "science",
        phaseSlug: "secondary",
      },
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
