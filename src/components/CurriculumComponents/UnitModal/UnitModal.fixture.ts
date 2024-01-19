import { Unit } from "@/components/CurriculumComponents/UnitsTab/UnitsTab";
import { Lesson } from "@/components/CurriculumComponents/UnitModal/UnitModal";

const lessons: Lesson[] = [
  {
    slug: "lesson-1",
    title: "Lesson 1",
    _state: "new",
  },
  {
    slug: "lesson-2",
    title: "Lesson 2",
    _state: "published",
  },
  {
    slug: "lesson-3",
    title: "Lesson 3",
    _state: "published",
  },
];

export const mockUnit: Unit = {
  connection_future_unit_description: "Test connection future unit description",
  connection_prior_unit_description: "Test connection prior unit description",
  connection_future_unit_title: "Test connection future unit title",
  connection_prior_unit_title: "Test connection prior unit title",
  domain: null,
  domain_id: null,
  examboard: null,
  examboard_slug: null,
  keystage_slug: "ks1",
  phase: "Primary",
  phase_slug: "primary",
  planned_number_of_lessons: 15,
  lessons: [],
  slug: "composition-of-numbers-6-to-10",
  subject: "Maths",
  subject_parent: null,
  subject_parent_slug: null,
  subject_slug: "maths",
  threads: [
    {
      slug: "number-addition-and-subtraction",
      title: "Number: Addition and Subtraction",
      order: 2,
    },
    {
      slug: "number",
      title: "Number",
      order: 1,
    },
  ],
  tier: null,
  tier_slug: null,
  title: "Composition of numbers 6 to 10",
  unit_options: [],
  year: "1",
};

export const mockUnitKS4: Unit = {
  connection_future_unit_description: "Test connection future unit description",
  connection_prior_unit_description: "Test connection prior unit description",
  connection_future_unit_title: "Test connection future unit title",
  connection_prior_unit_title: "Test connection prior unit title",
  domain: null,
  domain_id: null,
  examboard: "AQA",
  examboard_slug: "aqa",
  keystage_slug: "ks4",
  phase: "Secondary",
  phase_slug: "secondary",
  planned_number_of_lessons: 15,
  lessons,
  slug: "composition-of-numbers-6-to-10",
  subject: "Maths",
  subject_parent: null,
  subject_parent_slug: null,
  subject_slug: "maths",
  threads: [
    {
      slug: "number-addition-and-subtraction",
      title: "Number: Addition and Subtraction",
      order: 2,
    },
    {
      slug: "number",
      title: "Number",
      order: 1,
    },
  ],
  tier: null,
  tier_slug: null,
  title: "Composition of numbers 6 to 10",
  unit_options: [],
  year: "10",
};

const optionalUnits = [
  {
    title: "Test optional unit 1",
    unitvariant_id: 1,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    lessons,
  },
  {
    title: "Test optional unit 2",
    unitvariant_id: 2,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    lessons,
  },
  {
    title: "Test optional unit 3",
    unitvariant_id: 3,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    lessons,
  },
];

export const mockOptionalityUnit: Unit = {
  ...mockUnit,
  unit_options: optionalUnits,
};
