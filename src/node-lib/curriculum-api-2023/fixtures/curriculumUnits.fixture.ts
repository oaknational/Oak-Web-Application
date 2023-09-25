import { CurriculumUnitsTabData } from "..";

const curriculumUnitsTabFixture = (
  partial?: Partial<CurriculumUnitsTabData>,
): CurriculumUnitsTabData => ({
  ...{
    units: [
      {
        planned_number_of_lessons: 15,
        domains: [],
        threads: [
          {
            slug: "number-addition-and-subtraction",
            title: "Number: Addition and Subtraction",
          },
          {
            slug: "number",
            title: "Number",
          },
        ],
        connection_future_unit_description:
          "In this unit pupils will represent numbers 6 - 10 by partitioning in different ways. They will learn what odd and even numbers are and how they can be partitioned. They will identify a missing part when a whole is partitioned into 2 parts. In the future unit pupils will explain 11-19 cardinally and ordinally. They will double and halve numbers 6-9. They will add and subtract within 20.",
        connection_prior_unit_description:
          "In prior learning, pupils will have explored the composition of numbers to 10 and be able to subitise up to 5. In this unit pupils will represent numbers 6 to 10 by partitioning in different ways and learn what odd and even numbers are and how they can be partitioned.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks1",
        phase: "Primary",
        phase_slug: "primary",
        slug: "composition-of-numbers-6-to-10",
        subject: "Maths",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "maths",
        tier: null,
        tier_slug: null,
        title: "Composition of numbers 6 to 10",
        year: "1",
      },
      {
        planned_number_of_lessons: 9,
        domains: [],
        threads: [
          {
            slug: "bq01-what-are-living-things-and-what-are-they-made-of",
            title: "BQ01: What are living things and what are they made of?",
          },
        ],
        connection_future_unit_description:
          "Pupils will learn how substances essential for chemical reactions, and the products of the reactions, are transported into, around and out of the human body.",
        connection_prior_unit_description:
          "Pupils learned about differences in the cell structures of eukaryotic and prokaryotic organisms.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks4",
        phase: "Secondary",
        phase_slug: "secondary",
        slug: "biological-molecules-and-enzymes",
        subject: "Combined Science",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "combined-science",
        tier: null,
        tier_slug: null,
        title: "Biological molecules and enzymes",
        year: "10",
      },
      {
        planned_number_of_lessons: 8,
        domains: [],
        threads: [
          {
            slug: "number",
            title: "Number",
          },
        ],
        connection_future_unit_description: null,
        connection_prior_unit_description:
          "In the prior unit, pupils learnt how to round to a given number of decimal places or significant figures and explored the effect of using rounded numbers for calculations. In this unit, pupils will investigate the bounds and perform calculations to determine a best/worst case scenario.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks4",
        phase: "Secondary",
        phase_slug: "secondary",
        slug: "rounding-estimation-and-bounds",
        subject: "Maths",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "maths",
        tier: null,
        tier_slug: null,
        title: "Rounding, estimation and bounds",
        year: "10",
      },
      {
        planned_number_of_lessons: 5,
        domains: [],
        threads: [
          {
            slug: "bq01-what-are-living-things-and-what-are-they-made-of",
            title: "BQ01: What are living things and what are they made of?",
          },
        ],
        connection_future_unit_description:
          "Pupils will learn how substances essential for chemical reactions, and the products of the reactions, are transported into, around and out of plants, and about factors affecting the rate of water uptake by a plant.",
        connection_prior_unit_description:
          "Pupils learned about photosynthesis in producers, including a two-stage model of the process and the requirements and products of each stage.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks4",
        phase: "Secondary",
        phase_slug: "secondary",
        slug: "cellular-respiration-and-atp",
        subject: "Combined Science",
        subject_parent: "Science",
        subject_parent_slug: "science",
        subject_slug: "combined-science",
        tier: null,
        tier_slug: null,
        title: "Aerobic and anaerobic cellular respiration",
        year: "11",
      },
      {
        planned_number_of_lessons: 8,
        domains: [],
        threads: [
          {
            slug: "human-and-physical-processes-climate-and-weather",
            title: "Human and physical processes: climate and weather",
          },
          {
            slug: "earth-geometry",
            title: "Earth geometry",
          },
          {
            slug: "human-and-physical-processes-land-use-and-settlement",
            title: "Human and physical processes: land use and settlement",
          },
        ],
        connection_future_unit_description:
          "It then leads on to examine this same scale but by investigating hot places in Unit 10.  This unit also links to future understanding of land use and settlement, and builds on Earth Geometry by establishing familiarity with the Polar Circles here and with the Equator in the next unit.",
        connection_prior_unit_description:
          "Unit 9 links to work done in and around the school ground on weather and develops the idea of temperature variations and extreme cold on a global scale. ",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks1",
        phase: "Primary",
        phase_slug: "primary",
        slug: "cold-areas-whats-it-like-at-the-north-and-south-pole",
        subject: "Geography",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "geography",
        tier: null,
        tier_slug: null,
        title: "Cold places: Where are they and what are they like?",
        year: "2",
      },
      {
        planned_number_of_lessons: 10,
        domains: [],
        threads: [
          {
            slug: "number-fractions",
            title: "Number: Fractions",
          },
          {
            slug: "number",
            title: "Number",
          },
        ],
        connection_future_unit_description:
          "In this unit pupils will represent unit fractions in different ways, identifying the whole, the number of equal parts and the size of each part as a unit fraction including tenths. In the future unit pupils will identify parts and wholes in different contexts.",
        connection_prior_unit_description:
          "In the prior unit pupils identified whether something had or had not been split into equal parts. They named fractions one-half one-quarter and one-third in relation to a fraction of a length, shape or set of objects. In this unit pupils will represent unit fractions in different ways, identifying the whole, the number of equal parts and the size of each part as a unit fraction, including tenths.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks2",
        phase: "Primary",
        phase_slug: "primary",
        slug: "unit-fractions-as-part-of-a-whole",
        subject: "Maths",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "maths",
        tier: null,
        tier_slug: null,
        title: "Unit fractions as part of a whole",
        year: "3",
      },
      {
        planned_number_of_lessons: 5,
        domains: [],
        threads: [
          {
            slug: "statistics",
            title: "Statistics",
          },
          {
            slug: "number-fractions",
            title: "Number: Fractions",
          },
          {
            slug: "number-place-value",
            title: "Number: Place value",
          },
          {
            slug: "number",
            title: "Number",
          },
        ],
        connection_future_unit_description:
          " In this unit pupils will describe represent and order tenths as a decimal fraction. They will round a decimal number with tenths to the nearest whole number. In the future unit pupils will identify hundredths as part of a whole and describe and represent hundredths as a decimal fraction. They will compare and order decimal numbers with hundredths.",
        connection_prior_unit_description:
          "In the prior unit pupils explained the relationship between multiplying and dividing a number by 10 and multiples of 10.  In this unit pupils will describe, represent and order tenths as a decimal fraction. They will round a decimal number with tenths to the nearest whole number.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks2",
        phase: "Primary",
        phase_slug: "primary",
        slug: "understand-tenths-as-part-of-a-whole-represent-and-calculate-mentailly",
        subject: "Maths",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "maths",
        tier: null,
        tier_slug: null,
        title:
          "Understand tenths as part of a whole, represent and calculate mentally",
        year: "5",
      },
      {
        planned_number_of_lessons: 12,
        domains: [],
        threads: [
          {
            slug: "preparing-for-analytical-writing",
            title: "Preparing for analytical writing",
          },
          {
            slug: "aspects-of-narrative",
            title: "Aspects of narrative",
          },
        ],
        connection_future_unit_description:
          "In this unit, pupils learn how Shakespeare explores multiple key themes throughout a single play. In 'The Windrush: Diary Writing', pupils will learn to develop their skills of writing a diary with emotion based on a significant historical event.",
        connection_prior_unit_description:
          "In 'Shakespeare's Macbeth’: Narrative and Soliloquy Writing', pupils learnt about character, plot and theme in a Shakespearean play for the first time. In this unit, pupils will learn how Shakespeare explores multiple key themes throughout a single play.’",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks2",
        phase: "Primary",
        phase_slug: "primary",
        slug: "shakespeares-romeo-and-juliet-diary-and-narrative-writing",
        subject: "English",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "english",
        tier: null,
        tier_slug: null,
        title: "Shakespeare's ’Romeo and Juliet’: Diary and Narrative Writing",
        year: "6",
      },
      {
        planned_number_of_lessons: 10,
        domains: [],
        threads: [
          {
            slug: "bq07-what-are-things-made-of",
            title: "BQ07: What are things made of?",
          },
        ],
        connection_future_unit_description:
          "In the Patterns in the periodic table unit, pupils will build on this knowledge to learn how the chemical and physical properties of different elements are indicated by their position on the periodic table and about key groups of elements. ",
        connection_prior_unit_description:
          "In the Solutions unit, pupils learnt about mixtures, solutions and dissolving in terms of the particle model.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks3",
        phase: "Secondary",
        phase_slug: "secondary",
        slug: "atoms-elements-and-compounds",
        subject: "Science",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "science",
        tier: null,
        tier_slug: null,
        title: "Atoms, elements and compounds",
        year: "7",
      },
      {
        planned_number_of_lessons: 8,
        domains: [],
        threads: [
          {
            slug: "bq2-how-do-living-things-grow-and-reproduce",
            title: "BQ2: How do living things grow and reproduce?",
          },
        ],
        connection_future_unit_description:
          "Pupils will learn about flower structure, wind and insect pollination, fertilisation, seed and fruit formation and dispersal.",
        connection_prior_unit_description:
          "Pupils learned about heredity as the process of organisms passing on genetic material to their offspring during reproduction, and about DNA, genes and chromosomes.",
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks3",
        phase: "Secondary",
        phase_slug: "secondary",
        slug: "reproduction-in-humans",
        subject: "Science",
        subject_parent: null,
        subject_parent_slug: null,
        subject_slug: "science",
        tier: null,
        tier_slug: null,
        title: "Reproduction in humans",
        year: "8",
      },
    ],
    ...partial,
  },
});

export default curriculumUnitsTabFixture;
