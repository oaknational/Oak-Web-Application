import { generateEmptyDocx } from "../docx";

import generate from "./6_subjectPrincipals";
import { zipToSnapshotObject } from "./helper";

describe("6_subjectPrincipals", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate();

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
