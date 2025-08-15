import { generateEmptyDocx } from "../docx";

import generate from "./10_threadsDetail";
import { zipToSnapshotObject } from "./helper";

import { CombinedCurriculumData } from "@/utils/curriculum/types";

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

  it("pathway grouped", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        subjectTitle: "Computing",
        units: [
          // Thread 1 Units
          {
            year: "9",
            pathway_slug: null, // No pathway
            title: "Intro to Computing",
            threads: [{ title: "Algorithms", order: 0, slug: "algorithms" }],
            order: 0,
          },
          {
            year: "10",
            pathway_slug: "core",
            title: "Core Programming",
            threads: [{ title: "Algorithms", order: 1, slug: "algorithms" }],
            order: 1,
            subjectcategories: [
              { id: 1, title: "Programming", category: "prog" },
            ],
            actions: {
              subject_category_actions: { group_by_subjectcategory: true },
            },
          },
          {
            year: "10",
            pathway_slug: "gcse",
            title: "GCSE Data Representation",
            threads: [{ title: "Data", order: 0, slug: "data" }],
            order: 2,
            subjectcategories: [
              { id: 2, title: "Data Science", category: "data" },
            ],
            actions: {
              subject_category_actions: { group_by_subjectcategory: true },
            },
          },
          {
            year: "11",
            pathway_slug: "core",
            title: "Core Networking",
            threads: [{ title: "Networking", order: 0, slug: "networking" }],
            order: 3,
            subjectcategories: [{ id: 3, title: "Systems", category: "sys" }],
            actions: {
              subject_category_actions: { group_by_subjectcategory: true },
            },
          },
          // Thread 2 Units (different pathways/years)
          {
            year: "10",
            pathway_slug: "core",
            title: "Core Data Structures",
            threads: [{ title: "Algorithms", order: 2, slug: "algorithms" }],
            order: 4,
            subjectcategories: [
              { id: 1, title: "Programming", category: "prog" },
            ],
            actions: {
              subject_category_actions: { group_by_subjectcategory: true },
            },
          },
          {
            year: "11",
            pathway_slug: "gcse",
            title: "GCSE Databases",
            threads: [{ title: "Data", order: 1, slug: "data" }],
            order: 5,
            subjectcategories: [
              { id: 2, title: "Data Science", category: "data" },
            ],
            actions: {
              subject_category_actions: { group_by_subjectcategory: true },
            },
          },
          {
            year: "11",
            pathway_slug: null, // No pathway
            title: "Advanced Networking Topics",
            threads: [{ title: "Networking", order: 1, slug: "networking" }],
            order: 6,
            subjectcategories: [{ id: 3, title: "Systems", category: "sys" }],
            actions: {
              subject_category_actions: { group_by_subjectcategory: true },
            },
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
