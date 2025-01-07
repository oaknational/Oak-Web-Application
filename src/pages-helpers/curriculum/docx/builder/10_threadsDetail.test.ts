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
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "7",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "8",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "8",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "9",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "9",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "10",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "10",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "11",
            title: "Test A",
            threads: [{ title: "thread-one", order: 0, slug: "one" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
          {
            subject_slug: "english",
            phase_slug: "primary",
            year: "11",
            title: "Test B",
            threads: [{ title: "thread-two", order: 0, slug: "two" }],
            features: {
              subjectcategories: {
                all_disabled: true,
                default_category_id: 4,
                group_by_subjectcategory: true,
              },
            },
          },
        ],
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  describe("subject category grouping", () => {
    it("enables grouping when any unit has group_by_subjectcategory feature", async () => {
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
              features: {
                subjectcategories: {
                  group_by_subjectcategory: false,
                },
              },
            },
            {
              subject_slug: "english",
              phase_slug: "primary",
              year: "7",
              title: "Test B",
              threads: [{ title: "thread-two", order: 0, slug: "two" }],
              features: {
                subjectcategories: {
                  group_by_subjectcategory: true,
                },
              },
            },
          ],
        } as CombinedCurriculumData,
      });

      expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
    });

    it("disables grouping when no units have group_by_subjectcategory feature", async () => {
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
            },
            {
              subject_slug: "english",
              phase_slug: "primary",
              year: "7",
              title: "Test B",
              threads: [{ title: "thread-two", order: 0, slug: "two" }],
            },
          ],
        } as CombinedCurriculumData,
      });

      expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
    });
  });
});
