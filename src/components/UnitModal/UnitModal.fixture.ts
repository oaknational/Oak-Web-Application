import { Unit } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";

export const mockUnit: Unit = {
  connection_future_unit_description: "Test connection future unit description",
  connection_prior_unit_description: "Test connection prior unit description",
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

const optionalUnits = [
  {
    title: "Test optional unit 1",
    unitvariant_id: 1,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    lessons: [],
  },
  {
    title: "Test optional unit 2",
    unitvariant_id: 2,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    lessons: [],
  },
  {
    title: "Test optional unit 3",
    unitvariant_id: 3,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    lessons: [],
  },
];

export const mockOptionalityUnit: Unit = {
  ...mockUnit,
  unit_options: optionalUnits,
};
