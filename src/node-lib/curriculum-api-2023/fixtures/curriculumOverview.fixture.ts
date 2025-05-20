import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

export type curriculumOverviewTabSchema = {
  curriculumInfo: CurriculumOverviewMVData;
  curriculumCMSInfo: CurriculumOverviewSanityData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
};

export const curriculumOverviewTabFixture = (
  partial?: Partial<curriculumOverviewTabSchema>,
): curriculumOverviewTabSchema => {
  return {
    curriculumInfo: curriculumOverviewMVFixture(),
    curriculumCMSInfo: curriculumOverviewCMSFixture(),
    curriculumSelectionSlugs: curriculumOverviewSlugsFixture(),
    ...partial,
  };
};

export const curriculumOverviewCMSFixture = (
  partial?: Partial<CurriculumOverviewSanityData>,
): CurriculumOverviewSanityData => {
  return {
    id: "curriculum.overview",
    curriculumExplainer: {
      explainerRaw: [
        {
          children: [
            {
              _type: "span",
              marks: [],
              text: "Aims and purpose",
              _key: "470ecdd07b71",
            },
          ],
          _type: "block",
          style: "heading1",
          _key: "82cf6558d6f1",
          markDefs: [],
        },
        {
          children: [
            {
              _type: "span",
              marks: [],
              text: "Heading 1",
              _key: "470ecdd07b72",
            },
          ],
          _type: "block",
          style: "heading1",
          _key: "82cf6558d6f2",
          markDefs: [],
        },
        {
          children: [
            {
              _type: "span",
              marks: [],
              text: "Heading 2",
              _key: "470ecdd07b72",
            },
          ],
          _type: "block",
          style: "heading2",
          _key: "82cf6558d6f",
          markDefs: [],
        },
        {
          children: [
            {
              _type: "span",
              marks: [],
              text: "Heading 3",
              _key: "470ecdd07b73",
            },
          ],
          _type: "block",
          style: "heading3",
          _key: "82cf6558d6f4",
          markDefs: [],
        },
      ],
    },
    subjectPrinciples: [
      "Pairing procedural knowledge with conceptual understanding",
      "Aligning with the Concrete Pictorial Abstract approach to mathematics teaching and learning",
      "Use an agreed set of models and representations which bridge mathematical concepts",
      "Use of variation theory in practice tasks and modelling",
    ],
    partnerBio:
      "Mathematics in Education and Industry (MEI) is an established charity and curriculum development body. Their primary aims are to raise the quality of maths education and promote the relevance of maths education to everyone. MEI are highly respected and are well connected with other quality assured organisations, including being a key partner in the NCETM, and are well known in schools for their excellent training and support programmes.",
    curriculumPartner: {
      name: "Mathematics Education Innovation (MEI)",
      image: {
        asset: {
          _id: "image-ad404f56a775bce46cc57fc67c79f724d746d4df-866x722-png",
          url: "https://cdn.sanity.io/images/cuvjke51/curric-sanity-data/ad404f56a775bce46cc57fc67c79f724d746d4df-866x722.png",
        },
        hotspot: null,
      },
    },
    curriculumPartnerOverviews: [],
    ...partial,
  };
};

const curriculumOverviewSlugsFixture = (
  partial?: Partial<CurriculumSelectionSlugs>,
): CurriculumSelectionSlugs => {
  return {
    phaseSlug: "primary",
    subjectSlug: "maths",
    ks4OptionSlug: null,
    ...partial,
  };
};

const curriculaDesc =
  "Our curriculum provides adaptable, coherently sequenced units to allow students to develop a deep, sustained understanding of mathematics at Key Stages 1-4. Evidence informed approaches including variation and the development of core sets of models and representations to build pupil knowledge and conceptual understanding. Lessons are designed to be flexible, accessible and to acknowledge the diversity in our schools.\n" +
  "Central to the design of our curriculum is coherence in the development of key threads in mathematics. These threads reflect the structure of the National Curriculum, allowing teachers to track the development of key knowledge and skills.\n" +
  "Reasoning and problem solving are integral. Resources promote the use of vocabulary allowing pupils to articulate their thinking and strengthen both their procedural knowledge and conceptual understanding. Use of talk allows pupils to explore mathematical connections and use key vocabulary accurately when presenting their reasoning.";
export const curriculumOverviewMVFixture = (
  partial?: Partial<CurriculumOverviewMVData>,
): CurriculumOverviewMVData => {
  return {
    curriculaDesc,
    subjectTitle: "Maths",
    phaseTitle: "Secondary",
    examboardTitle: null,
    ...partial,
  };
};

export default curriculumOverviewTabFixture;
