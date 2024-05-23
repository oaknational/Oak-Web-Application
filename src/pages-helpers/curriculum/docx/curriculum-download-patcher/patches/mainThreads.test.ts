import { CombinedCurriculumData } from "..";

import { mainThreadsPatch } from "./mainThreads";

describe("coverPatch", () => {
  it("should modify node for KS1-2", async () => {
    const patcher = mainThreadsPatch({
      units: [
        {
          year: "8",
          threads: [
            {
              slug: "test1",
              title: "TEST_1",
            },
            {
              slug: "test2",
              title: "TEST_2",
            },
            {
              slug: "test3",
              title: "TEST_3",
            },
          ],
        },
        {
          year: "9",
          threads: [
            {
              slug: "test4",
              title: "TEST_4",
            },
            {
              slug: "test5",
              title: "TEST_5",
            },
            {
              slug: "test6",
              title: "TEST_6",
            },
          ],
        },
        {
          year: "10",
          threads: [
            {
              slug: "test7",
              title: "TEST_7",
            },
            {
              slug: "test8",
              title: "TEST_8",
            },
            {
              slug: "test9",
              title: "TEST_9",
            },
          ],
        },
      ],
    } as CombinedCurriculumData);

    const output = await patcher();
    const json = JSON.stringify(output, null, 2);

    expect(json).toContain("Year 8");
    expect(json).toContain("Year 9");
    expect(json).toContain("Year 10");

    expect(json).toContain("TEST_1");
    expect(json).toContain("TEST_2");
    expect(json).toContain("TEST_3");
    expect(json).toContain("TEST_4");
    expect(json).toContain("TEST_5");
    expect(json).toContain("TEST_6");
    expect(json).toContain("TEST_7");
    expect(json).toContain("TEST_8");
    expect(json).toContain("TEST_9");

    expect(json).toMatchSnapshot();
  });
});
