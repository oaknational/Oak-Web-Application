import { GraphQLClient } from "graphql-request";

import { getSdk } from "./generated/sdk";

const graphqlClient = new GraphQLClient(process.env.CURRICULUM_API_URL || "", {
  headers: {
    // @todo use token from config
    "X-Hasura-Admin-Secret": process.env.CURRICULUM_API_ADMIN_SECRET || "",
  },
});

export type TeachersHomePageData = {
  keyStages: {
    slug: string;
    title: string;
    shortCode: string;
  }[];
};

export type TeachersKeyStageSubjectsData = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjects: {
    slug: string;
    title: string;
    keyStageSlug: string;
    keyStageTitle: string;
    unitCount: number | null;
    lessonCount: number | null;
    tierCount: number | null;
  }[];
};

export type TeachersKeyStageSubjectTiersData = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  lessonCount: number | null;
  unitCount: number | null;
  tiers: {
    slug: string;
    title: string;
    unitCount: number | null;
    lessonCount: number | null;
  }[];
};

export type TeachersKeyStageSubjectUnitsData = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  tierSlug: string | null;
  tiers: {
    slug: string;
    title: string;
    unitCount: number | null;
  }[];
  units: {
    slug: string;
    title: string;
    keyStageSlug: string;
    keyStageTitle: string;
    subjectSlug: string;
    subjectTitle: string;
    themeSlug: string;
    themeTitle: string;
    lessonCount: number | null;
    quizCount: number | null;
  }[];
};

const sdk = getSdk(graphqlClient);

const curriculumApi = {
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();

    return {
      keyStages: res.mv_key_stages.filter(
        (ks) => Boolean(ks.title) && Boolean(ks.slug) && Boolean(ks.shortCode)
      ) as { slug: string; title: string; shortCode: string }[],
    } as TeachersHomePageData;
  },
  teachersKeyStageSubjects: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjects>
  ) => {
    const res = await sdk.teachersKeyStageSubjects(...args);

    return {
      keyStageSlug: args[0].keyStageSlug,
      keyStageTitle: (res.mv_subjects[0]?.keyStageTitle || null) as string,
      subjects: res.mv_subjects.filter(
        (ks) =>
          Boolean(ks.title) &&
          Boolean(ks.slug) &&
          Boolean(ks.keyStageTitle) &&
          Boolean(ks.keyStageSlug)
      ),
    } as TeachersKeyStageSubjectsData;
  },
  teachersKeyStageSubjectTiers: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjectTiers>
  ) => {
    const res = await sdk.teachersKeyStageSubjectTiers(...args);

    return {
      keyStageSlug: res.mv_key_stages[0]?.slug,
      keyStageTitle: res.mv_key_stages[0]?.title,
      subjectSlug: res.mv_subjects[0]?.slug,
      subjectTitle: res.mv_subjects[0]?.title,
      unitCount: res.mv_subjects[0]?.unitCount,
      lessonCount: res.mv_subjects[0]?.lessonCount,
      tiers: res.mv_tiers,
    } as TeachersKeyStageSubjectTiersData;
  },
  teachersKeyStageSubjectTiersPaths: async () => {
    const pairs = (await sdk.teachersKeyStageSubjectUnitsPaths())
      .mv_subjects as {
      subjectSlug: string;
      keyStageSlug: string;
    }[];

    return pairs;
  },
  teachersKeyStageSubjectUnits: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjectUnits>
  ) => {
    const res = await sdk.teachersKeyStageSubjectUnits(...args);

    return {
      keyStageSlug: res.mv_key_stages[0]?.slug,
      keyStageTitle: res.mv_key_stages[0]?.title,
      subjectSlug: res.mv_subjects[0]?.slug,
      subjectTitle: res.mv_subjects[0]?.title,
      tierSlug: args[0].tierSlug || null,
      tiers: res.mv_tiers,
      units: res.mv_units,
    } as TeachersKeyStageSubjectUnitsData;
  },
  teachersKeyStageSubjectUnitsPaths: async () => {
    const pairs = (await sdk.teachersKeyStageSubjectUnitsPaths())
      .mv_subjects as {
      subjectSlug: string;
      keyStageSlug: string;
    }[];

    return pairs;
  },
};

export type CurriculumApi = typeof curriculumApi;
export default curriculumApi;
