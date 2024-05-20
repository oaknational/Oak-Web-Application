import { CombinedCurriculumData } from "..";
import { jsonXmlToXmlString } from "../../xml";

import { unitsTablePatch } from "./unitsTable";

describe("unitsTablePatch", () => {
  const patcher = unitsTablePatch({
    units: [
      {
        title: "TEST_1",
        year: "7",
      },
      {
        title: "TEST_2",
        year: "8",
      },
      {
        title: "TEST_3",
        year: "8",
      },
    ],
  } as CombinedCurriculumData);

  it("should modify node when valid element passed", async () => {
    const output = await patcher({
      type: "element",
      name: "w:p",
      elements: [
        {
          type: "element",
          name: "w:r",
          elements: [
            {
              type: "element",
              name: "w:t",
              elements: [
                {
                  type: "text",
                  text: "{{=UNITS_TABLE}}",
                },
              ],
            },
          ],
        },
      ],
    });

    const xml = jsonXmlToXmlString(output);

    // Just check the data has made it's way through to the output XML
    expect(xml).toContain("Year 7 units");
    expect(xml).toContain("TEST_1");
    expect(xml).toContain("Year 8 units");
    expect(xml).toContain("TEST_2");
    expect(xml).toContain("TEST_3");

    // Check the output hasn't changed
    expect(output).toMatchSnapshot();
  });

  it("should not modify invalid element", async () => {
    const tree = {
      type: "element",
      name: "w:p",
      elements: [
        {
          type: "element",
          name: "w:r",
          elements: [
            {
              type: "element",
              name: "w:t",
              elements: [
                {
                  type: "text",
                  text: "{{=SOMETHING_ELSE}}",
                },
              ],
            },
          ],
        },
      ],
    };

    const output = await patcher(tree);
    expect(output).toBe(tree);
  });
});
