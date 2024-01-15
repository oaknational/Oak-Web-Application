import { Unit } from "@/components/CurriculumComponents/UnitsTab/UnitsTab";

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
  lessons: [
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
  ],
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
  lessons: [
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
  ],
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

export const mockUnitOptionalityKS4: Unit = {
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
  lessons: [
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
  ],
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
  year: "10",
  unit_options: [
    {
      connection_future_unit_description: null,
      connection_prior_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      title: "Love and relationships poetry continued",
      lessons: [
        {
          slug: "understanding-the-poem-singh-song",
          title: 'Understanding the poem "Singh Song"',
          _state: "new",
        },
        {
          slug: "analysing-the-poem-singh-song",
          title: 'Analysing the poem "Singh Song"',
          _state: "new",
        },
        {
          slug: "understanding-the-poem-the-farmers-bride",
          title: 'Understanding the poem "The Farmer\'s Bride"',
          _state: "published",
        },
      ],
      unitvariant_id: 191,
    },
    {
      connection_future_unit_description: null,
      connection_prior_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      title: " Power and conflict poetry continued",
      lessons: [
        {
          slug: "key-themes-from-power-and-conflict-revision",
          title: "Key themes from Power and Conflict revision",
          _state: "new",
        },
        {
          slug: "refining-comparative-essay-writingon-power-and-conflict",
          title: "Refining comparative essay writingon Power and Conflict",
          _state: "new",
        },
      ],
      unitvariant_id: 172,
    },
  ],
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
    lessons: [
      {
        slug: "lesson-1",
        title: "Lesson 1",
        order: 1,
        _state: "new",
      },
      {
        slug: "lesson-2",
        title: "Lesson 2",
        order: 2,
        _state: "new",
      },
      {
        slug: "lesson-3",
        title: "Lesson 3",
        order: 3,
        _state: "published",
      },
    ],
  },
  {
    title: "Test optional unit 2",
    unitvariant_id: 2,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    lessons: [
      {
        slug: "lesson-1",
        title: "Lesson 1",
        order: 1,
        _state: "new",
      },
      {
        slug: "lesson-2",
        title: "Lesson 2",
        order: 2,
        _state: "new",
      },
      {
        slug: "lesson-3",
        title: "Lesson 3",
        order: 3,
        _state: "new",
      },
    ],
  },
  {
    title: "Test optional unit 3",
    unitvariant_id: 3,
    connection_future_unit_description:
      "Test connection future unit description",
    connection_prior_unit_description: "Test connection prior unit description",
    connection_future_unit_title: "Test connection future unit title",
    connection_prior_unit_title: "Test connection prior unit title",
    lessons: [
      {
        slug: "lesson-1",
        title: "Lesson 1",
        order: 1,
        _state: "new",
      },
      {
        slug: "lesson-2",
        title: "Lesson 2",
        order: 2,
        _state: "new",
      },
      {
        slug: "lesson-3",
        title: "Lesson 3",
        order: 3,
        _state: "new",
      },
    ],
  },
];

export const mockOptionalityUnit: Unit = {
  ...mockUnit,
  unit_options: optionalUnits,
};
