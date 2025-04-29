import { CombinedCurriculumData } from "..";
import { generateEmptyDocx } from "../docx";

import generate from "./10_threadsDetail";
import { zipToSnapshotObject } from "./helper";

describe("10_threadsDetail", () => {
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
            order: 0,
          },
          {
            year: "7",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 1,
          },
          {
            year: "8",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 2,
          },
          {
            year: "8",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 3,
          },
          {
            year: "9",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 4,
          },
          {
            year: "9",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 5,
          },
          {
            year: "10",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 6,
          },
          {
            year: "10",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 7,
          },
          {
            year: "11",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 8,
          },
          {
            year: "11",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 9,
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("subjectcategory grouped", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "English",
        units: [
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "7",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 0,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "7",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 1,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "8",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 2,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "8",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 3,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "9",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 4,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "9",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 5,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "10",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 6,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "10",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 7,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "11",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            order: 8,
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "11",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            order: 9,
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
