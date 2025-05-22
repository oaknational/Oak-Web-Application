import { createUnit } from "@/fixtures/curriculum/unit";
import { createThread } from "@/fixtures/curriculum/thread";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";
import { createLesson } from "@/fixtures/curriculum/lesson";

const lessons = [
  createLesson({
    slug: "lesson-1",
    title: "Lesson 1",
    _state: "new",
  }),
  createLesson({
    slug: "lesson-2",
    title: "Lesson 2",
    _state: "published",
  }),
  createLesson({
    slug: "lesson-3",
    title: "Lesson 3",
    _state: "published",
  }),
];

export const mockUnit = createUnit({
  connection_future_unit_description: "Test connection future unit description",
  connection_prior_unit_description: "Test connection prior unit description",
  connection_future_unit_title: "Test connection future unit title",
  connection_prior_unit_title: "Test connection prior unit title",
  keystage_slug: "ks1",
  phase: "Primary",
  phase_slug: "primary",
  slug: "composition-of-numbers-6-to-10",
  subject: "Maths",
  subject_slug: "maths",
  threads: [
    createThread({
      slug: "number-addition-and-subtraction",
      title: "Number: Addition and Subtraction",
      order: 2,
    }),
    createThread({
      slug: "number",
      title: "Number",
      order: 1,
    }),
  ],
  title: "Composition of numbers 6 to 10",
  year: "1",
});

export const mockUnitWhyThisWhyNow = createUnit({
  description: "Test description",
  why_this_why_now: "Test why this why now",
  keystage_slug: "ks1",
  phase: "Primary",
  phase_slug: "primary",
  slug: "composition-of-numbers-6-to-10",
  subject: "Maths",
  subject_slug: "maths",
  parent_programme_features: {
    unit_description: true,
  },
  threads: [
    createThread({
      slug: "number-addition-and-subtraction",
      title: "Number: Addition and Subtraction",
      order: 2,
    }),
    createThread({
      slug: "number",
      title: "Number",
      order: 1,
    }),
  ],
  title: "Composition of numbers 6 to 10",
  year: "1",
});

export const mockYearData = {
  "1": createYearData({
    units: [mockUnit],
  }),
};

export const mockUnitKS4 = createUnit({
  connection_future_unit_description: "Test connection future unit description",
  connection_prior_unit_description: "Test connection prior unit description",
  connection_future_unit_title: "Test connection future unit title",
  connection_prior_unit_title: "Test connection prior unit title",
  examboard: "AQA",
  examboard_slug: "aqa",
  keystage_slug: "ks4",
  phase: "Secondary",
  phase_slug: "secondary",
  lessons,
  order: 1,
  slug: "composition-of-numbers-6-to-10",
  subject: "Maths",
  subject_slug: "maths",
  threads: [
    createThread({
      slug: "number-addition-and-subtraction",
      title: "Number: Addition and Subtraction",
      order: 2,
    }),
    createThread({
      slug: "number",
      title: "Number",
      order: 1,
    }),
  ],
  title: "Composition of numbers 6 to 10",
  year: "10",
});

const optionalUnits = [
  createUnitOption({
    title: "Test optional unit 1",
    unitvariant_id: 1,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    lessons,
    state: "published",
    slug: "composition-of-numbers-6-to-10-1",
  }),
  createUnitOption({
    title: "Test optional unit 2",
    unitvariant_id: 2,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    why_this_why_now: null,
    description: null,
    lessons,
    state: "published",
    slug: "composition-of-numbers-6-to-10-2",
  }),
  createUnitOption({
    title: "Test optional unit 3",
    unitvariant_id: 3,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    lessons,
    state: "published",
    slug: "composition-of-numbers-6-to-10-3",
  }),
];

export const mockOptionalityUnit = createUnit({
  ...mockUnit,
  unit_options: optionalUnits,
});
