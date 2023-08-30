import { CurriculumUnitsTabData } from "..";

const curriculumUnitsTabFixture = (
  partial?: Partial<CurriculumUnitsTabData>
): CurriculumUnitsTabData => ({
  ...{
    units: [
      {
        title: "2, 4 and 8 times tables: using times tables to solve problems",
        slug: "2-4-and-8-times-tables-using-times-tables-to-solve-problems",
        subject: "Maths",
        subject_slug: "maths",
        phase: "Primary",
        phase_slug: "primary",
        year: "3",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "number-multiplication-and-division",
            title: "Number: Multiplication and division",
          },
          {
            slug: "number-place-value",
            title: "Number: Place value",
          },
          {
            slug: "statistics",
            title: "Statistics",
          },
          {
            slug: "number",
            title: "Number",
          },
        ],
      },
      {
        title:
          "7 times table: odd and even patterns, square numbers and tests of divisibility",
        slug: "7-times-table-odd-and-even-patterns-square-numbers-and-tests-of-divisibility",
        subject: "Maths",
        subject_slug: "maths",
        phase: "Primary",
        phase_slug: "primary",
        year: "4",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "number-multiplication-and-division",
            title: "Number: Multiplication and division",
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
      },
      {
        title: "’A Christmas Carol’: Narrative Writing and Reading",
        slug: "a-christmas-carol-narrative-writing-and-reading",
        subject: "English",
        subject_slug: "english",
        phase: "Primary",
        phase_slug: "primary",
        year: "4",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "aspects-of-narrative",
            title: "Aspects of narrative",
          },
        ],
      },
      {
        title: "Action words",
        slug: "developing-narrative-vocabulary-action-words",
        subject: "English",
        subject_slug: "english",
        phase: "Primary",
        phase_slug: "primary",
        year: "5",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "aspects-of-narrative",
            title: "Aspects of narrative",
          },
        ],
      },
      {
        title:
          "11th-Century Islamic Worlds: How similar were the regions of the Islamic World?",
        slug: "11th-century-islamic-worlds-how-similar-were-the-regions-of-the-islamic-world",
        subject: "History",
        subject_slug: "history",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "7",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "trade-ideas-and-communication",
            title: "Trade, ideas and communication",
          },
        ],
      },
      {
        title: "Acids and bases",
        slug: "acids-bases-and-alkalis",
        subject: "Science",
        subject_slug: "science",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "8",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "bq08-how-can-substances-be-made-and-changed",
            title: "BQ08: How can substances be made and changed?",
          },
        ],
      },
      {
        title: "Adaptations, competition, natural selection and evolution",
        slug: "adaptation-competition-natural-selection-and-evolution",
        subject: "Science",
        subject_slug: "science",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "9",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "bq04-why-are-there-similarities-and-differences-between-living-things",
            title:
              "BQ04: Why are there similarities and differences between living things?",
          },
        ],
      },
      {
        title: "12 Bar Blues",
        slug: "pop-12-bar-blues-and-rock",
        subject: "Music",
        subject_slug: "music",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "10",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "improvising-and-composing-daw",
            title: "Improvising and composing (DAW)",
          },
        ],
      },
      {
        title: "2D and 3D shape: compound shapes",
        slug: "2d-and-3d-shape-compound-shapes",
        subject: "Maths",
        subject_slug: "maths",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "10",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "geometry-and-measure",
            title: "Geometry and Measure",
          },
          {
            slug: "geometry-and-measure",
            title: "Geometry and Measure",
          },
          {
            slug: "geometry-and-measure",
            title: "Geometry and Measure",
          },
        ],
      },
      {
        title:
          "2D and 3D shape: surface area and volume (pyramids, spheres and cones)",
        slug: "2d-and-3d-shape-surface-area-and-volume-pyramids-spheres-and-cones",
        subject: "Maths",
        subject_slug: "maths",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "11",
        examboard: null,
        examboard_slug: null,
        threads: [
          {
            slug: "geometry-and-measure",
            title: "Geometry and Measure",
          },
          {
            slug: "geometry-and-measure",
            title: "Geometry and Measure",
          },
          {
            slug: "geometry-and-measure",
            title: "Geometry and Measure",
          },
        ],
      },
      {
        title: "USA: Why was the USA involved in Vietnam?",
        slug: "usa-why-was-the-usa-involved-in-vietnam",
        subject: "History",
        subject_slug: "history",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "11",
        examboard: "Edexcel",
        examboard_slug: "edexcel",
        threads: [
          {
            slug: "warfare-and-conflict",
            title: "Warfare and conflict",
          },
        ],
      },
      {
        title: "USA: Why did some activists reject peaceful protest?",
        slug: "usa-why-did-some-activists-reject-peaceful-protest",
        subject: "History",
        subject_slug: "history",
        phase: "Secondary",
        phase_slug: "secondary",
        year: "11",
        examboard: "Edexcel",
        examboard_slug: "edexcel",
        threads: [
          {
            slug: "trade-ideas-and-communication",
            title: "Trade, ideas and communication",
          },
        ],
      },
    ],
    ...partial,
  },
});

export default curriculumUnitsTabFixture;
