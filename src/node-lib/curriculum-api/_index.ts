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
  }[];
};

export type TeachersKeyStageSubjectUnitsData = {
  keyStageSlug: string;
  subjectSlug: string;
  units: {
    slug: string;
    title: string;
    keyStageSlug: string;
    keyStageTitle: string;
    subjectSlug: string;
    subjetcTitle: string;
    themeSlug: string;
    themeTitle: string;
    lessonCount: string;
    quizCount: string;
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
  teachersKeyStageSubjectUnits: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjectUnits>
  ) => {
    const res = await sdk.teachersKeyStageSubjectUnits(...args);

    return {
      keyStageSlug: args[0].keyStageSlug,
      subjectSlug: args[0].subjectSlug,
      units: res.mv_units.filter((ks) =>
        // @todo this is not real logic, change to zod
        Object.values(ks).reduce((acc, value) => acc && Boolean(value), true)
      ),
    } as TeachersKeyStageSubjectUnitsData;
  },
};

export type CurriculumApi = typeof curriculumApi;
export default curriculumApi;
