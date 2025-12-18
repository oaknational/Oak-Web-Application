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
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS3",
          keystage_slug: "ks3",
          phase_slug: "secondary",
          subject: "Maths",
          subject_slug: "maths",
        },
      }),
      features: { non_curriculum: false },
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Maths",
          subject_slug: "maths",
        },
      }),
      features: {},
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
    },
  ],
};
