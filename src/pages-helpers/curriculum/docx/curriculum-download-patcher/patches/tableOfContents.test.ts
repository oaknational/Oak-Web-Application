import { CombinedCurriculumData } from "..";
import { jsonXmlToXmlString } from "../../xml";

import { tableOfContentsPatch } from "./tableOfContents";

describe("tableOfContents", () => {
  const data = {
    units: [
      { year: "7" },
      { year: "9" },
      { year: "10" },
      { year: "8" },
      { year: "11" },
    ],
  } as CombinedCurriculumData;
  it("should modify node if present", async () => {
    const patcher = tableOfContentsPatch(data);

    const node = await patcher({
      type: "element",
      name: "w:p",
      elements: [
        {
          type: "element",
          name: "w:r",
          elements: [
            {
              type: "text",
              text: "testing {{=TABLE_OF_CONTENTS}} a node",
            },
          ],
        },
      ],
    });

    const xml = jsonXmlToXmlString(node);
    expect(xml).toContain("Year 7");
    expect(xml).toContain("Year 8");
    expect(xml).toContain("Year 9");
    expect(xml).toContain("Year 10");
    expect(xml).toContain("Year 11");
    expect(node).toMatchSnapshot();
  });

  it("should not modify invalid element", async () => {
    const patcher = await tableOfContentsPatch(data);

    const input = {
      type: "element",
      name: "w:p",
      elements: [
        {
          type: "element",
          name: "w:r",
          elements: [
            {
              type: "text",
              text: "testing {{=FOOBAR}} a node",
            },
          ],
        },
      ],
    };
    const node = await patcher(input);

    expect(node).toEqual(input);
  });
});
