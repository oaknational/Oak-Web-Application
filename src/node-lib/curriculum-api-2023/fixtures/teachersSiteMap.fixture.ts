import { keysToCamelCase } from "zod-to-camel-case";

import { TeachersSitemapDataSchemaSnake } from "../queries/teachersSitemap/teacherSitemap.schema";

export const teachersSitemapProgrammeFilterUnitsFixtureSnake: TeachersSitemapDataSchemaSnake["programmeFilterUnits"] =
  [
    {
      subject_slug: "english",
      phase_slug: "primary",
      examboard_slug: null,
      pathway_slug: null,
      year: "1",
      keystage_slug: "ks1",
      subject_parent_slug: null,
      non_curriculum: false,
      state: "published",
    },
    {
      subject_slug: "english",
      phase_slug: "secondary",
      examboard_slug: "aqa",
      pathway_slug: null,
      year: "10",
      keystage_slug: "ks4",
      subject_parent_slug: null,
      non_curriculum: false,
      state: "published",
    },
    {
      subject_slug: "english",
      phase_slug: "secondary",
      examboard_slug: "aqa",
      pathway_slug: null,
      year: "7",
      keystage_slug: "ks3",
      subject_parent_slug: null,
      non_curriculum: false,
      state: "published",
    },
    {
      subject_slug: "english",
      phase_slug: "secondary",
      examboard_slug: "edexcel",
      pathway_slug: null,
      year: "11",
      keystage_slug: "ks4",
      subject_parent_slug: null,
      non_curriculum: false,
      state: "published",
    },
    {
      subject_slug: "geography",
      phase_slug: "secondary",
      examboard_slug: null,
      pathway_slug: null,
      year: "8",
      keystage_slug: "ks3",
      subject_parent_slug: null,
      non_curriculum: false,
      state: "published",
    },
    {
      subject_slug: "citizenship",
      phase_slug: "secondary",
      examboard_slug: null,
      pathway_slug: "gcse",
      year: "10",
      keystage_slug: "ks4",
      subject_parent_slug: null,
      non_curriculum: false,
      state: "published",
    },
    {
      subject_slug: "rule-of-law",
      phase_slug: "primary",
      examboard_slug: null,
      pathway_slug: null,
      year: "3",
      keystage_slug: "ks2",
      subject_parent_slug: null,
      non_curriculum: true,
      actions: {
        programme_field_overrides: { year_slug: "all-years" },
      },
      state: "published",
    },
    {
      subject_slug: "rule-of-law",
      phase_slug: "primary",
      examboard_slug: null,
      pathway_slug: null,
      year: "1",
      keystage_slug: "ks1",
      subject_parent_slug: null,
      non_curriculum: true,
      actions: {
        programme_field_overrides: { year_slug: "all-years" },
      },
      state: "published",
    },
    {
      subject_slug: "physical-education",
      phase_slug: "primary",
      examboard_slug: null,
      pathway_slug: null,
      year: "3",
      keystage_slug: "ks2",
      subject_parent_slug: null,
      non_curriculum: false,
      state: "published",
    },
    {
      subject_slug: "physical-education",
      phase_slug: "primary",
      examboard_slug: null,
      pathway_slug: null,
      year: "4",
      keystage_slug: "ks2",
      subject_parent_slug: null,
      non_curriculum: false,
      actions: {
        programme_field_overrides: { year_slug: "all-years" },
        group_units_as: "Swimming and water safety",
      },
      state: "published",
    },
  ];

export const teachersSitemapDataFixture: TeachersSitemapDataSchemaSnake = {
  units: [
    {
      programme_slug: "programme-1",
      unit_slug: "unit-1",
    },
    {
      programme_slug: "programme-2",
      unit_slug: "unit-2",
    },
  ],
  lessons: [
    {
      programme_slug: "programme-1",
      unit_slug: "unit-1",
      lesson_slug: "lesson-1",
    },
    {
      programme_slug: "programme-2",
      unit_slug: "unit-2",
      lesson_slug: "lesson-2",
    },
  ],
  programmeFilterUnits: teachersSitemapProgrammeFilterUnitsFixtureSnake,
};

export const teachersSitemapDataFixtureCamelCase = {
  ...keysToCamelCase({
    units: teachersSitemapDataFixture.units,
    lessons: teachersSitemapDataFixture.lessons,
  }),
  programmeFilterUnits: teachersSitemapProgrammeFilterUnitsFixtureSnake.map(
    (unit) => {
      const { actions, ...rest } = unit;

      return {
        ...keysToCamelCase(rest),
        actions,
      };
    },
  ),
};

const newDate = new Date();
export const generatedFields = [
  {
    loc: "https:/www.thenational.academy/teachers/key-stages/ks3/subjects",
    lastmod: newDate.toISOString(),
  },
];
