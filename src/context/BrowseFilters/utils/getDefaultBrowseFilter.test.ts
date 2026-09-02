import { getDefaultBrowseFilter } from "./getDefaultBrowseFilter";

import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { Unit } from "@/utils/curriculum/types";
import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";

describe("getDefaultFilter", () => {
  it("with data", () => {
    const out = getDefaultBrowseFilter({
      yearData: {
        "7": {
          units: [] as Unit[],
          tiers: [{ tier_slug: "foundation", tier: "Foundation" }],
          childSubjects: [{ subject: "Physics", subject_slug: "physics" }],
          subjectCategories: [
            createSubjectCategory({ id: 2, slug: "sub-cat-2" }),
          ],
        } as CurriculumUnitsYearData["year"],
        "8": {
          units: [] as Unit[],
          tiers: [{ tier_slug: "higher", tier: "Higher" }],
          childSubjects: [{ subject: "Biology", subject_slug: "biology" }],
          subjectCategories: [
            createSubjectCategory({ id: 1, slug: "sub-cat-1" }),
          ],
        } as CurriculumUnitsYearData["year"],
      },
      threadOptions: [],
      yearOptions: ["7", "8"],
      keystages: [],
    });
    expect(out).toEqual({
      childSubjects: ["biology"],
      subjectCategories: ["sub-cat-1"],
      threads: [],
      tiers: ["foundation"],
      years: ["7", "8"],
      pathways: [],
      keystages: [],
    });
  });
});
