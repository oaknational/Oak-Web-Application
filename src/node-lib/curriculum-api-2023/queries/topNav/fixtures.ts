import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { TopNavResponse } from "./topNav.schema";

export const mockResponseData: TopNavResponse = {
  programmes: [
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS1",
          keystage_slug: "ks1",
          phase_slug: "primary",
          subject: "Art and design",
          subject_slug: "art",
          year_slug: "year-2",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks1",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS1",
          keystage_slug: "ks1",
          phase_slug: "primary",
          subject: "Art and design",
          subject_slug: "art",
          year_slug: "year-3",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks1",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS1",
          keystage_slug: "ks1",
          phase_slug: "primary",
          subject: "Art and design",
          subject_slug: "art",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks1",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS2",
          keystage_slug: "ks2",
          phase_slug: "primary",
          subject: "Art and design",
          subject_slug: "art",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks2",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS3",
          keystage_slug: "ks3",
          phase_slug: "secondary",
          subject: "Art and design",
          subject_slug: "art",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-secondary-ks3",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS1",
          keystage_slug: "ks1",
          phase_slug: "primary",
          subject: "Financial education",
          subject_slug: "financial-education",
        },
      }),
      features: { non_curriculum: true },
      actions: {},
      programme_slug: "financial-education-primary-ks1",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS2",
          keystage_slug: "ks2",
          phase_slug: "primary",
          subject: "Financial education",
          subject_slug: "financial-education",
        },
      }),
      features: { non_curriculum: true },
      actions: {},
      programme_slug: "financial-education-primary-ks2",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS3",
          keystage_slug: "ks3",
          phase_slug: "secondary",
          subject: "Computing",
          subject_slug: "computing",
        },
      }),
      features: { non_curriculum: false },
      actions: {},
      programme_slug: "computing-secondary-ks3",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Computing",
          subject_slug: "computing",
          pathway_slug: "core",
          pathway: "Core",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "computing-secondary-ks4-core",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Computing",
          subject_slug: "computing",
          pathway_slug: "gcse",
          pathway: "GCSE",
          examboard_slug: "edexcel",
          examboard: "Edexcel",
        },
      }),
      features: {},
      actions: {
        programme_field_overrides: {
          subject: "Computer science",
        },
      },
      programme_slug: "computing-secondary-ks4-gcse-edexcel",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Computing",
          subject_slug: "computing",
          pathway_slug: "gcse",
          pathway: "GCSE",
          examboard_slug: "aqa",
          examboard: "AQA",
        },
      }),

      features: {},
      actions: {
        programme_field_overrides: {
          subject: "Computer science",
        },
      },
      programme_slug: "computing-secondary-ks4-gcse-aqa",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "EYFS",
          keystage_slug: "early-years-foundation-stage",
          phase_slug: "foundation",
          subject: "Maths",
          subject_slug: "maths",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "maths-foundation-early-years-foundation-stage-l",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Maths",
          subject_slug: "maths",
          tier: "higher",
          tier_slug: "higher",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "maths-secondary-ks4-higher",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Maths",
          subject_slug: "maths",
          tier: "foundation",
          tier_slug: "foundation",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "maths-secondary-ks4-foundation",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Religious education",
          subject_slug: "religious-education",
          pathway_slug: "gcse",
          pathway: "GCSE",
          examboard_slug: "aqa",
          examboard: "AQA",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "religious-education-secondary-ks4-gcse-aqa",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Religious education",
          subject_slug: "religious-education",
          pathway_slug: "gcse",
          pathway: "GCSE",
          examboard_slug: "edexcelb",
          examboard: "Edexcel B",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "religious-education-secondary-ks4-gcse-edexcelb",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Religious education",
          subject_slug: "religious-education",
          pathway_slug: "gcse",
          pathway: "GCSE",
          examboard_slug: "eduqas",
          examboard: "Eduqas",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "religious-education-secondary-ks4-gcse-eduqas",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Religious education",
          subject_slug: "religious-education",
          dataset: "legacy",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "religious-education-secondary-ks4-l",
    },
  ],
};

export const mockResponseByYears: TopNavResponse = {
  programmes: [
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-1",
          year_description: "Year 1",
          phase_slug: "primary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks1",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-2",
          year_description: "Year 2",
          phase_slug: "primary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks1",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-3",
          year_description: "Year 3",
          phase_slug: "primary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks2",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-4",
          year_description: "Year 4",
          phase_slug: "primary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks2",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-5",
          year_description: "Year 5",
          phase_slug: "primary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks2",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-6",
          year_description: "Year 6",
          phase_slug: "primary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks2",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-7",
          year_description: "Year 7",
          phase_slug: "secondary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-secondary-ks3",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-8",
          year_description: "Year 8",
          phase_slug: "secondary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks3",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-9",
          year_description: "Year 9",
          phase_slug: "secondary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks3",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-10",
          year_description: "Year 10",
          phase_slug: "secondary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks4",
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-11",
          year_description: "Year 11",
          phase_slug: "secondary",
        },
      }),
      features: {},
      actions: {},
      programme_slug: "art-primary-ks4",
    },
  ],
};
