import { generateEmptyDocx } from "../docx";
import { zipToSimpleObject } from "../zip";

import generate from "./4_threadsExplainer";

describe("4_threadsExplainer", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      slugs: {
        subjectSlug: "science",
        phaseSlug: "secondary",
      },
    });

    expect(zipToSimpleObject(zip)).toMatchSnapshot();
  });
});
