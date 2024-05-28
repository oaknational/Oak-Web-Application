import { CombinedCurriculumData } from "..";
import { jsonXmlToXmlString } from "../../xml";

import { unitsTablePatch } from "./unitsTable";

describe("unitsTablePatch", () => {
  const inputData = {
    units: [
      {
        slug: "one",
        title: "TEST_1",
        year: "7",
        threads: [
          {
            title: "test1",
          },
          {
            title: "test2",
          },
        ],
      },
      {
        slug: "two",
        title: "TEST_2",
        year: "7",
        threads: [
          {
            title: "test1",
          },
        ],
      },
      // Next defines 2 duplicates
      {
        slug: "three",
        title: "TEST_3",
        year: "7",
        threads: [],
      },
      {
        slug: "three",
        title: "TEST_3",
        year: "7",
        threads: [],
      },
    ],
  } as CombinedCurriculumData;

  it("should return units table", async () => {
    const output = await unitsTablePatch("7", {}, inputData.units, {
      isCycle2Review: false,
      noPrePageBreak: false,
    });

    const xml = jsonXmlToXmlString(output);

    // Just check the data has made it's way through to the output XML
    expect(xml).toContain("Year 7 units");
    expect(xml).toContain("TEST_1");
    expect(xml).toContain("TEST_2");
    expect(xml).toContain("TEST_3");

    // Check the output hasn't changed
    expect(output).toMatchSnapshot();
  });
});
