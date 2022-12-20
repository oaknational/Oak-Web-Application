import { GraphQLClient } from "graphql-request";
import { z } from "zod";

import config from "../../config/server";

import { getSdk } from "./generated/sdk";

const curriculumApiUrl = config.get("curriculumApiUrl");
const curriculumApiAuthType = config.get("curriculumApiAuthType");
const curriculumApiAuthKey = config.get("curriculumApiAuthKey");

const graphqlClient = new GraphQLClient(curriculumApiUrl, {
  headers: {
    "x-oak-auth-type": curriculumApiAuthType,
    "x-oak-auth-key": curriculumApiAuthKey,
  },
});

/**
 * Rather than using a lib, or build a function to deeply transform any keys
 * from snake_case to camelCase, we prefer to make sucha transform in the gql
 * query. However, we are unable (using codegen) to transform the names of
 * the tables from which data is returned. So for simplicity, this function
 * transforms just the upper most level (the table/MV names) of the responses
 * from the gql queries.
 */
const transformMVCase = <K, S, T, U, L>(res: {
  mv_key_stages?: K;
  mv_subjects?: S;
  mv_tiers?: T;
  mv_units?: U;
  mv_lessons?: L;
}) => {
  return {
    keyStages: res.mv_key_stages,
    subjects: res.mv_subjects,
    tiers: res.mv_tiers,
    units: res.mv_units,
    lessons: res.mv_lessons,
  };
};

const teachersHomePageData = z.object({
  keyStages: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      shortCode: z.string(),
    })
  ),
});
const teachersKeyStageSubjectsData = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjects: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      keyStageSlug: z.string(),
      keyStageTitle: z.string(),
      unitCount: z.number().nullable(),
      lessonCount: z.number().nullable(),
      tierCount: z.number().nullable(),
    })
  ),
});

const teachersKeyStageSubjectTiersData = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tiers: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      unitCount: z.number().nullable(),
      lessonCount: z.number().nullable(),
    })
  ),
});
const teachersKeyStageSubjectTiersPathsSchema = z.object({
  tiers: z.array(
    z.object({
      subjectSlug: z.string(),
      keyStageSlug: z.string(),
    })
  ),
});
const teachersKeyStageSubjectUnitsData = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  tiers: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      unitCount: z.number().nullable(),
    })
  ),
  units: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      keyStageSlug: z.string(),
      keyStageTitle: z.string(),
      subjectSlug: z.string(),
      subjectTitle: z.string(),
      themeSlug: z.string(),
      themeTitle: z.string(),
      lessonCount: z.number().nullable(),
      quizCount: z.number().nullable(),
    })
  ),
});
const teachersKeyStageSubjectUnitsPathsSchema = z.object({
  subjects: z.array(
    z.object({
      subjectSlug: z.string(),
      keyStageSlug: z.string(),
    })
  ),
});
const teachersKeyStageSubjectUnitsLessonsData = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  lessons: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      keyStageSlug: z.string(),
      keyStageTitle: z.string(),
      subjectSlug: z.string(),
      subjectTitle: z.string(),
      unitSlug: z.string(),
      themeSlug: z.string(),
      themeTitle: z.string(),
      quizCount: z.number().nullable(),
      videoCount: z.number().nullable(),
      presentationCount: z.number().nullable(),
      worksheetCount: z.number().nullable(),
    })
  ),
});

export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;
export type TeachersKeyStageSubjectsData = z.infer<
  typeof teachersKeyStageSubjectsData
>;

export type TeachersKeyStageSubjectTiersData = z.infer<
  typeof teachersKeyStageSubjectTiersData
>;

export type TeachersKeyStageSubjectUnitsData = z.infer<
  typeof teachersKeyStageSubjectUnitsData
>;

export type TeachersKeyStageSubjectUnitsLessonsData = z.infer<
  typeof teachersKeyStageSubjectUnitsLessonsData
>;

const sdk = getSdk(graphqlClient);

const curriculumApi = {
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();

    return teachersHomePageData.parse(transformMVCase(res));
  },
  teachersKeyStageSubjects: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjects>
  ) => {
    const res = await sdk.teachersKeyStageSubjects(...args);
    const { keyStages, subjects } = transformMVCase(res);

    return teachersKeyStageSubjectsData.parse({
      keyStageSlug: keyStages?.[0]?.slug,
      keyStageTitle: keyStages?.[0]?.title,
      subjects,
    });
  },
  teachersKeyStageSubjectTiers: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjectTiers>
  ) => {
    const res = await sdk.teachersKeyStageSubjectTiers(...args);
    const { tiers, subjects, keyStages } = transformMVCase(res);

    return teachersKeyStageSubjectTiersData.parse({
      keyStageSlug: keyStages?.[0]?.slug,
      keyStageTitle: keyStages?.[0]?.title,
      subjectSlug: subjects?.[0]?.slug,
      subjectTitle: subjects?.[0]?.title,
      tiers,
    });
  },
  teachersKeyStageSubjectTiersPaths: async () => {
    const res = await sdk.teachersKeyStageSubjectTiersPaths();
    const { tiers } = transformMVCase(res);

    return teachersKeyStageSubjectTiersPathsSchema.parse({
      tiers,
    });
  },
  teachersKeyStageSubjectUnits: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjectUnits>
  ) => {
    const res = await sdk.teachersKeyStageSubjectUnits(...args);
    const { tiers, units, keyStages, subjects } = transformMVCase(res);
    return teachersKeyStageSubjectUnitsData.parse({
      keyStageSlug: keyStages?.[0]?.slug,
      keyStageTitle: keyStages?.[0]?.title,
      subjectSlug: subjects?.[0]?.slug,
      subjectTitle: subjects?.[0]?.title,
      tierSlug: args[0].tierSlug,
      tiers,
      units,
    });
  },
  teachersKeyStageSubjectUnitsPaths: async () => {
    const res = await sdk.teachersKeyStageSubjectUnitsPaths();
    const { subjects } = transformMVCase(res);
    return teachersKeyStageSubjectUnitsPathsSchema.parse({
      subjects,
    });
  },
};

export type CurriculumApi = typeof curriculumApi;
export default curriculumApi;
