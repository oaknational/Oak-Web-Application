import { CombinedCurriculumData } from "..";
import { jsonXmlToXmlString } from "../../xml";

import { threadsTablePatch } from "./threadsTable";

describe("threadsTablePatch", () => {
  const thread1 = {
    slug: "TEST_THREAD_1",
    title: "test thread 1",
    order: 0,
  };
  const thread2 = {
    slug: "TEST_THREAD_2",
    title: "test thread 2",
    order: 1,
  };
  const thread3 = {
    slug: "TEST_THREAD_3",
    title: "test thread 3",
    order: 2,
  };
  const inputData = {
    units: [
      {
        slug: "one",
        title: "TEST_1",
        year: "7",
        threads: [thread1, thread2],
      },
      {
        slug: "two",
        title: "TEST_2",
        year: "7",
        threads: [thread2],
      },
      // Next defines 2 duplicates
      {
        slug: "three",
        title: "TEST_3",
        year: "7",
        threads: [thread2, thread3],
      },
      {
        slug: "three",
        title: "TEST_3",
        year: "7",
        threads: [
          {
            slug: "TEST_1",
            title: "test1",
            order: 3,
          },
          {
            slug: "TEST_2",
            title: "test2",
            order: 2,
          },
        ],
      },
    ],
  } as CombinedCurriculumData;

  it("should return units table", async () => {
    const patcher = threadsTablePatch(inputData);

    const root = {
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
                  text: "testing {{=THREADS_TABLE}} a node",
                },
              ],
            },
          ],
        },
      ],
    };
    const output = await patcher(root);
    const xml = jsonXmlToXmlString(output);

    // Just check the data has made it's way through to the output XML
    // expect(xml).toContain("Year 7 units");
    expect(xml).toContain("test thread 1");
    expect(xml).toContain("test thread 2");
    expect(xml).toContain("test thread 3");

    // Check the output hasn't changed
    expect(output).toMatchSnapshot();
  });
});
