import { generateEmptyDocx } from "../docx";

import generate from "./9_threadsOverview";
import { zipToSnapshotObject } from "./helper";

import { CombinedCurriculumData } from "@/utils/curriculum/types";

describe("9_threadsOverview", () => {
  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "Science",
        units: [
          {
            year: "7",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
          },
          {
            year: "7",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
          },
          {
            year: "8",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
          },
          {
            year: "8",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
          },
          {
            year: "9",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
          },
          {
            year: "9",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
          },
          {
            year: "10",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
          },
          {
            year: "10",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
          },
          {
            year: "11",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
          },
          {
            year: "11",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
