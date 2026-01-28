import React from "react";
import "@testing-library/jest-dom";

import { subjectHeroImages } from "./getSubjectHeroImageUrl";
import {
  ProgrammeHeader,
  pickSubjectTitleFromFilters,
} from "./ProgrammeHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

const baseProps = {
  subject: "music" as const,
  subjectTitle: "Science",
  phaseTitle: "Secondary",
  summary: "Test content for the programme header.",
  bullets: ["Bullet 1", "Bullet 2"],
};

describe("ProgrammeHeader", () => {
  describe("subject illustration image", () => {
    it("renders presentational image with correct src URL", () => {
      const { getByTestId } = renderWithTheme(
        <ProgrammeHeader {...baseProps} />,
      );
      const imageContainer = getByTestId("subject-hero-image");
      const subjectHeroImage = imageContainer.querySelector("img");

      expect(subjectHeroImage).toBeInTheDocument();
      expect(subjectHeroImage?.getAttribute("src")).toContain(
        subjectHeroImages.music,
      );
    });
  });

  describe("heading", () => {
    it("renders heading with subjectTitle and phaseTitle when schoolYear is not provided", () => {
      const { getByRole } = renderWithTheme(<ProgrammeHeader {...baseProps} />);

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "Science secondary",
      );
    });

    it("renders heading with subjectTitle and schoolYear when schoolYear is provided", () => {
      const { getByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} schoolYear="9" />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "Science year 9",
      );
    });

    it("renders heading with Primary phase title correctly", () => {
      const { getByRole } = renderWithTheme(
        <ProgrammeHeader
          {...baseProps}
          subjectTitle="English"
          phaseTitle="Primary"
        />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "English primary",
      );
    });
  });

  it("renders summary text", () => {
    const { getByText } = renderWithTheme(<ProgrammeHeader {...baseProps} />);

    expect(
      getByText("Test content for the programme header."),
    ).toBeInTheDocument();
  });

  describe("bullets rendering", () => {
    it("renders all bullet points", () => {
      const { getAllByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} />,
      );
      const listItems = getAllByRole("listitem");

      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent("Bullet 1");
      expect(listItems[1]).toHaveTextContent("Bullet 2");
    });

    it("renders bullets as list items", () => {
      const { getAllByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} />,
      );

      const listItems = getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("does not render bullets list when bullets array is empty", () => {
      const { queryByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} bullets={[]} />,
      );
      const list = queryByRole("list");

      expect(list).not.toBeInTheDocument();
    });

    it("does not render bullets list when bullets prop is undefined", () => {
      const { queryByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} bullets={undefined} />,
      );
      const list = queryByRole("list");

      expect(list).not.toBeInTheDocument();
    });
  });

  describe("slots rendering", () => {
    it("renders header slot content when provided", () => {
      const headerContent = "Breadcrumb navigation";
      const { getByText } = renderWithTheme(
        <ProgrammeHeader {...baseProps} headerSlot={headerContent} />,
      );

      expect(getByText(headerContent)).toBeInTheDocument();
    });

    it("renders footer slot content when provided", () => {
      const footerContent = "Action buttons";
      const { getByText } = renderWithTheme(
        <ProgrammeHeader {...baseProps} footerSlot={footerContent} />,
      );

      expect(getByText(footerContent)).toBeInTheDocument();
    });
  });
});

describe("pickSubjectTitleFromFilters", () => {
  const createDataWithChildSubjects = (): CurriculumUnitsFormattedData => ({
    yearData: {
      "7": createYearData({
        units: [createUnit({ slug: "test1", year: "7" })],
        // NOTE: childSubjects filter is only displayed when there are 2+ options
        // at a given keystage. `byKeyStageSlug` drops childSubjects when there is only 1.
        childSubjects: [
          createChildSubject({ subject_slug: "physics" }),
          createChildSubject({ subject_slug: "biology" }),
        ],
      }),
    },
    threadOptions: [],
    yearOptions: ["7"],
  });

  const createDataWithSubjectCategories = (): CurriculumUnitsFormattedData => ({
    yearData: {
      "7": createYearData({
        units: [createUnit({ slug: "test1", year: "7" })],
        subjectCategories: [
          createSubjectCategory({ id: 1, slug: "biology", title: "Biology" }),
        ],
      }),
    },
    threadOptions: [],
    yearOptions: ["7"],
  });

  const createDataWithBothDisplayed = (): CurriculumUnitsFormattedData => ({
    yearData: {
      // KS2: subjectCategories are displayed when there are no childSubjects at that key stage.
      "3": createYearData({
        units: [createUnit({ slug: "test-ks2", year: "3" })],
        subjectCategories: [
          createSubjectCategory({
            id: 1,
            slug: "chemistry",
            title: "Chemistry",
          }),
        ],
      }),
      // KS3: childSubjects are displayed when there are 2+ options at that key stage.
      "7": createYearData({
        units: [createUnit({ slug: "test-ks3", year: "7" })],
        childSubjects: [
          createChildSubject({ subject_slug: "chemistry" }),
          createChildSubject({ subject_slug: "physics" }),
        ],
      }),
    },
    threadOptions: [],
    yearOptions: ["3", "7"],
  });

  const createDataWithNeither = (): CurriculumUnitsFormattedData => ({
    yearData: {
      "7": createYearData({
        units: [createUnit({ slug: "test1", year: "7" })],
      }),
    },
    threadOptions: [],
    yearOptions: ["7"],
  });

  describe("when subjectCategoriesDisplayed and subjectCategories === 'all'", () => {
    it("returns null", () => {
      const data = createDataWithSubjectCategories();
      const filters = createFilter({
        subjectCategories: ["all"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });
  });

  describe("when there is only one childSubject and one subjectCategories and they are equal", () => {
    it("returns childSubject title when both are displayed and equal", () => {
      const data = createDataWithBothDisplayed();
      const filters = createFilter({
        childSubjects: ["chemistry"],
        subjectCategories: ["chemistry"],
        years: ["3", "7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBe("Chemistry");
    });
  });

  describe("when childSubjectsDisplayed is false and subjectCategoriesDisplayed is true", () => {
    it("returns subjectCategory title when it has an item", () => {
      const data = createDataWithSubjectCategories();
      const filters = createFilter({
        subjectCategories: ["biology"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBe("Biology");
    });

    it("returns null when subjectCategory is 'all'", () => {
      const data = createDataWithSubjectCategories();
      const filters = createFilter({
        subjectCategories: ["all"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });
  });

  describe("when subjectCategoriesDisplayed is false and childSubjectsDisplayed is true", () => {
    it("returns childSubject title when it has an item", () => {
      const data = createDataWithChildSubjects();
      const filters = createFilter({
        childSubjects: ["physics"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBe("Physics");
    });
  });

  describe("edge cases", () => {
    it("returns null when no filters are applied", () => {
      const data = createDataWithNeither();
      const filters = createFilter({
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });

    it("returns null when multiple childSubjects are selected", () => {
      const data = createDataWithChildSubjects();
      const filters = createFilter({
        childSubjects: ["physics", "chemistry"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });

    it("returns null when multiple subjectCategories are selected", () => {
      const data = createDataWithSubjectCategories();
      const filters = createFilter({
        subjectCategories: ["biology", "chemistry"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });

    it("returns null when childSubjectsDisplayed is true but childSubject is undefined", () => {
      const data = createDataWithChildSubjects();
      const filters = createFilter({
        childSubjects: [],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });

    it("returns null when subjectCategoriesDisplayed is true but subjectCategory is undefined", () => {
      const data = createDataWithSubjectCategories();
      const filters = createFilter({
        subjectCategories: [],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });

    it("returns null when both are displayed but values don't match", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          // KS2: subjectCategories displayed
          "3": createYearData({
            units: [createUnit({ slug: "test-ks2", year: "3" })],
            subjectCategories: [
              createSubjectCategory({
                id: 1,
                slug: "biology",
                title: "Biology",
              }),
            ],
          }),
          // KS3: childSubjects displayed (2+ options)
          "7": createYearData({
            units: [createUnit({ slug: "test-ks3", year: "7" })],
            childSubjects: [
              createChildSubject({ subject_slug: "physics" }),
              createChildSubject({ subject_slug: "chemistry" }),
            ],
          }),
        },
        threadOptions: [],
        yearOptions: ["3", "7"],
      };
      const filters = createFilter({
        childSubjects: ["physics"],
        subjectCategories: ["biology"],
        years: ["3", "7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });

    it("returns null when childSubject slug is not found in data", () => {
      const data = createDataWithChildSubjects();
      const filters = createFilter({
        childSubjects: ["nonexistent"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });

    it("returns null when subjectCategory slug is not found in data", () => {
      const data = createDataWithSubjectCategories();
      const filters = createFilter({
        subjectCategories: ["nonexistent"],
        years: ["7"],
      });

      const result = pickSubjectTitleFromFilters(data, filters);

      expect(result).toBeNull();
    });
  });
});
