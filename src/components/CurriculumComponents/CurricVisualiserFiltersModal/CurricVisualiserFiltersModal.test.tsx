import { CurricMobileFilterModal } from ".";

import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createTier } from "@/fixtures/curriculum/tier";
import { createThread } from "@/fixtures/curriculum/thread";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

describe("CurricVisualiserFiltersModal", () => {
  describe("render", () => {
    it("only subjectCategories", () => {
      const filters = createFilter({ years: ["7"] });
      const subCat1 = createSubjectCategory({ id: 1 });
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            subjectCategories: [subCat1],
          }),
        },
        threadOptions: [],
        yearOptions: ["7"],
      };
      const slugs: CurriculumSelectionSlugs = {
        subjectSlug: "english",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      };
      const onSelectYear = jest.fn();
      const { getAllByRole } = renderWithTheme(
        <CurricMobileFilterModal
          filters={filters}
          onChangeFilters={() => {}}
          data={data}
          slugs={slugs}
          selectedYear={"7"}
          onSelectYear={onSelectYear}
          ks4Options={[]}
        />,
      );

      const headings = getAllByRole("heading");
      expect(headings.length).toEqual(1);
      expect(headings?.[0]?.textContent).toEqual("Category (KS3)");
    });

    it("only subject childSubjects", () => {});

    it("only subject tiers", () => {
      const filters = createFilter({ years: ["7"] });
      const tierFoundation = createTier({ tier_slug: "foundation" });
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            tiers: [tierFoundation],
          }),
        },
        threadOptions: [],
        yearOptions: ["7"],
      };
      const slugs: CurriculumSelectionSlugs = {
        subjectSlug: "english",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      };
      const onSelectYear = jest.fn();
      const { getAllByRole } = renderWithTheme(
        <CurricMobileFilterModal
          filters={filters}
          onChangeFilters={() => {}}
          data={data}
          slugs={slugs}
          selectedYear={"7"}
          onSelectYear={onSelectYear}
          ks4Options={[]}
        />,
      );

      const headings = getAllByRole("heading");
      expect(headings.length).toEqual(1);
      expect(headings?.[0]?.textContent).toEqual("Learning tier (KS3)");
    });

    it("only subject threads", () => {
      const filters = createFilter({ years: ["7"] });
      const thread1 = createThread({ slug: "thread1" });
      const thread2 = createThread({ slug: "thread2" });
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData(),
        },
        threadOptions: [thread1, thread2],
        yearOptions: ["7"],
      };
      const slugs: CurriculumSelectionSlugs = {
        subjectSlug: "english",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      };
      const onSelectYear = jest.fn();
      const { container } = renderWithTheme(
        <CurricMobileFilterModal
          filters={filters}
          onChangeFilters={() => {}}
          data={data}
          slugs={slugs}
          selectedYear={"7"}
          onSelectYear={onSelectYear}
          ks4Options={[]}
        />,
      );

      const groups = container.querySelectorAll("legend");
      expect(groups.length).toEqual(1);
      expect(groups?.[0]?.textContent).toEqual("Highlight a thread");
    });

    it("all except subjectCategories", () => {
      const filters = createFilter({ years: ["7"] });
      const subCat1 = createSubjectCategory({ id: 1 });
      const subCat2 = createSubjectCategory({ id: 2 });
      const tierFoundation = createTier({ tier_slug: "foundation" });
      const thread1 = createThread({ slug: "thread1" });
      const thread2 = createThread({ slug: "thread2" });
      const childSubject1 = createChildSubject({ subject_slug: "child_sub_1" });
      const childSubject2 = createChildSubject({ subject_slug: "child_sub_2" });
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            tiers: [tierFoundation],
            subjectCategories: [subCat1, subCat2],
            childSubjects: [childSubject1, childSubject2],
          }),
        },
        threadOptions: [thread1, thread2],
        yearOptions: ["7"],
      };
      const slugs: CurriculumSelectionSlugs = {
        subjectSlug: "english",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      };
      const onSelectYear = jest.fn();
      const { getAllByRole, container } = renderWithTheme(
        <CurricMobileFilterModal
          filters={filters}
          onChangeFilters={() => {}}
          data={data}
          slugs={slugs}
          selectedYear={"7"}
          onSelectYear={onSelectYear}
          ks4Options={[]}
        />,
      );

      const groups = container.querySelectorAll("legend");
      expect(groups.length).toEqual(1);
      expect(groups?.[0]?.textContent).toEqual("Highlight a thread");

      const headings = getAllByRole("heading");
      expect(headings.length).toEqual(2);
      expect(headings?.[0]?.textContent).toEqual("Exam subject (KS3)");
      expect(headings?.[1]?.textContent).toEqual("Learning tier (KS3)");
    });

    it("all except childSubjects", () => {
      const filters = createFilter({ years: ["7"] });
      const tierFoundation = createTier({ tier_slug: "foundation" });
      const thread1 = createThread({ slug: "thread1" });
      const thread2 = createThread({ slug: "thread2" });
      const subCat1 = createSubjectCategory({ id: 1 });
      const subCat2 = createSubjectCategory({ id: 2 });
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            tiers: [tierFoundation],
            subjectCategories: [subCat1, subCat2],
          }),
        },
        threadOptions: [thread1, thread2],
        yearOptions: ["7"],
      };
      const slugs: CurriculumSelectionSlugs = {
        subjectSlug: "english",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      };
      const onSelectYear = jest.fn();
      const { getAllByRole, container } = renderWithTheme(
        <CurricMobileFilterModal
          filters={filters}
          onChangeFilters={() => {}}
          data={data}
          slugs={slugs}
          selectedYear={"7"}
          onSelectYear={onSelectYear}
          ks4Options={[]}
        />,
      );

      const groups = container.querySelectorAll("legend");
      expect(groups.length).toEqual(1);
      expect(groups?.[0]?.textContent).toEqual("Highlight a thread");

      const headings = getAllByRole("heading");
      expect(headings.length).toEqual(2);
      expect(headings?.[0]?.textContent).toEqual("Category (KS3)");
      expect(headings?.[1]?.textContent).toEqual("Learning tier (KS3)");
    });
  });

  // describe("interactive", () => {
  //     // TODO...
  // })
});
