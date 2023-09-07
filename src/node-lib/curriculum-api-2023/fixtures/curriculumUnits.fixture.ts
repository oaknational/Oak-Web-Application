import { CurriculumUnitsTabData } from "..";

const curriculumUnitsTabFixture = (
  partial?: Partial<CurriculumUnitsTabData>,
): CurriculumUnitsTabData => ({
  ...{
    units: [
      {
        title: "Counting, recognising and comparing numbers 0-10",
        slug: "counting-recognising-and-comparing-numbers-0-10",
      },
      {
        title: "Counting to and from 20",
        slug: "counting-to-and-from-20",
      },
      {
        title: "Counting in tens - decade numbers",
        slug: "counting-in-tens-decade-numbers",
      },
      {
        title: "Pattern in counting from 20 to 100",
        slug: "pattern-in-counting-from-20-to-100",
      },
      {
        title: "Comparing quantities - part whole relationships",
        slug: "comparing-quantities-part-whole-relationships",
      },
      {
        title: "Composition of numbers 0 to 5",
        slug: "composition-of-numbers-0-to-5",
      },
      {
        title: "Recognise, compose, decompose and manipulate 3D shapes",
        slug: "recognise-compose-decompose-and-manipulate-3d-shapes",
      },
      {
        title: " Composition of numbers 6 to 10",
        slug: "composition-of-numbers-6-to-10",
      },
    ],
    threads: [
      {
        title: "Algebra",
        slug: "algebra",
      },
      {
        title: "Geometry and Measure",
        slug: "geometry-and-measure",
      },
      {
        title: "Number",
        slug: "number",
      },
      {
        title: "Probability",
        slug: "probability",
      },
      {
        title: "Ratio and Proportion",
        slug: "ratio-and-proportion",
      },
      {
        title: "Statistics",
        slug: "statistics",
      },
    ],
  },
  ...partial,
});

export default curriculumUnitsTabFixture;
