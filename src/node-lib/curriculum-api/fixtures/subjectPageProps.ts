import {
  KeyStagePageProps,
  ProgrammeProps,
} from "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";

const subjectPagePropsFixture = (
  partial?: Partial<ProgrammeProps & KeyStagePageProps>
): ProgrammeProps & KeyStagePageProps => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    programmesBySubjectAvailable: {
      biology: [
        {
          slug: "biology",
          title: "Biology",
          keyStageSlug: "ks4",
          unitCount: 1,
          programmeSlug: "biology-secondary-ks4",
          tierSlug: null,
        },
      ],
      chemistry: [
        {
          slug: "chemistry",
          title: "Chemistry",
          keyStageSlug: "ks4",
          unitCount: 1,
          programmeSlug: "chemistry-secondary-ks4",
          tierSlug: null,
        },
      ],
      citizenship: [
        {
          slug: "citizenship",
          title: "Citizenship",
          keyStageSlug: "ks4",
          unitCount: 12,
          programmeSlug: "citizenship-secondary-ks4",
          tierSlug: null,
        },
      ],
      "combined-science": [
        {
          slug: "combined-science",
          title: "Combined Science",
          keyStageSlug: "ks4",
          unitCount: 2,
          programmeSlug: "combined-science-secondary-ks4-foundation",
          tierSlug: "foundation",
        },
        {
          slug: "combined-science",
          title: "Combined Science",
          keyStageSlug: "ks4",
          unitCount: 2,
          programmeSlug: "combined-science-secondary-ks4-higher",
          tierSlug: "higher",
        },
      ],
      computing: [
        {
          slug: "computing",
          title: "Computing",
          keyStageSlug: "ks4",
          unitCount: 15,
          programmeSlug: "computing-secondary-ks4",
          tierSlug: null,
        },
      ],
      "computing-non-gcse": [
        {
          slug: "computing-non-gcse",
          title: "Computing (Non-GCSE)",
          keyStageSlug: "ks4",
          unitCount: 4,
          programmeSlug: "computing-non-gcse-secondary-ks4",
          tierSlug: null,
        },
      ],
      french: [
        {
          slug: "french",
          title: "French",
          keyStageSlug: "ks4",
          unitCount: 8,
          programmeSlug: "french-secondary-ks4",
          tierSlug: null,
        },
      ],
      german: [
        {
          slug: "german",
          title: "German",
          keyStageSlug: "ks4",
          unitCount: 8,
          programmeSlug: "german-secondary-ks4",
          tierSlug: null,
        },
      ],
      latin: [
        {
          slug: "latin",
          title: "Latin",
          keyStageSlug: "ks4",
          unitCount: 4,
          programmeSlug: "latin-secondary-ks4",
          tierSlug: null,
        },
      ],
      maths: [
        {
          slug: "maths",
          title: "Maths",
          keyStageSlug: "ks4",
          unitCount: 61,
          programmeSlug: "maths-secondary-ks4-core",
          tierSlug: "core",
        },
        {
          slug: "maths",
          title: "Maths",
          keyStageSlug: "ks4",
          unitCount: 63,
          programmeSlug: "maths-secondary-ks4-foundation",
          tierSlug: "foundation",
        },
        {
          slug: "maths",
          title: "Maths",
          keyStageSlug: "ks4",
          unitCount: 63,
          programmeSlug: "maths-secondary-ks4-higher",
          tierSlug: "higher",
        },
      ],
      "religious-education": [
        {
          slug: "religious-education",
          title: "Religious Education",
          keyStageSlug: "ks4",
          unitCount: 10,
          programmeSlug: "religious-education-secondary-ks4",
          tierSlug: null,
        },
      ],
      "rshe-pshe": [
        {
          slug: "rshe-pshe",
          title: "RSHE (PSHE)",
          keyStageSlug: "ks4",
          unitCount: 13,
          programmeSlug: "rshe-pshe-secondary-ks4",
          tierSlug: null,
        },
      ],
      spanish: [
        {
          slug: "spanish",
          title: "Spanish",
          keyStageSlug: "ks4",
          unitCount: 8,
          programmeSlug: "spanish-secondary-ks4",
          tierSlug: null,
        },
      ],
    },
    programmesBySubjectUnavailable: {
      art: [
        {
          slug: "art",
          title: "Art & Design",
          keyStageSlug: "ks4",
          unitCount: 0,
          programmeSlug: "art-secondary-ks4",
          tierSlug: null,
        },
      ],
      english: [
        {
          slug: "english",
          title: "English",
          keyStageSlug: "ks4",
          unitCount: 0,
          programmeSlug: "english-secondary-ks4",
          tierSlug: null,
        },
      ],
      geography: [
        {
          slug: "geography",
          title: "Geography",
          keyStageSlug: "ks4",
          unitCount: 0,
          programmeSlug: "geography-secondary-ks4",
          tierSlug: null,
        },
      ],
      history: [
        {
          slug: "history",
          title: "History",
          keyStageSlug: "ks4",
          unitCount: 0,
          programmeSlug: "history-secondary-ks4",
          tierSlug: null,
        },
      ],
      physics: [
        {
          slug: "physics",
          title: "Physics",
          keyStageSlug: "ks4",
          unitCount: 0,
          programmeSlug: "physics-secondary-ks4",
          tierSlug: null,
        },
      ],
    },
    ...partial,
  };
};

export const subjectCardListemProps =
  subjectPagePropsFixture().programmesBySubjectAvailable;

export default subjectPagePropsFixture;
