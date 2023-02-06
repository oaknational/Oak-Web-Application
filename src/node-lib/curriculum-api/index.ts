import { GraphQLClient } from "graphql-request";
import { z } from "zod";

//import errorReporter from "../../common-lib/error-reporter";
import config from "../../config/server";
import OakError from "../../errors/OakError";

import { getSdk } from "./generated/sdk";

//const reportError = errorReporter("curriculum-api");

const curriculumApiUrl = config.get("curriculumApiUrl");
const curriculumApiAuthType = config.get("curriculumApiAuthType");
const curriculumApiAuthKey = config.get("curriculumApiAuthKey");

/**
 * 'Admin secret' for local development only.
 * Basically we should be able to use auth-type and auth-key for both local and
 * cloud authentication (according to Thomas) but locally it's not working so
 * need to use admin-secret instead.
 */
const curruclumApiAdminSecret = process.env.CURRICULUM_API_ADMIN_SECRET;

/**
 * TS complaining when Headers in not typed.
 */
type Headers =
  | { "x-hasura-admin-secret": string }
  | { "x-oak-auth-type": string; "x-oak-auth-key": string };
const headers: Headers = curruclumApiAdminSecret
  ? {
      "x-hasura-admin-secret": curruclumApiAdminSecret,
    }
  : {
      "x-oak-auth-type": curriculumApiAuthType,
      "x-oak-auth-key": curriculumApiAuthKey,
    };

const graphqlClient = new GraphQLClient(curriculumApiUrl, { headers });

/**
 * Rather than using a lib, or build a function to deeply transform any keys
 * from snake_case to camelCase, we prefer to make such a transform in the gql
 * query. However, we are unable (using codegen) to transform the names of
 * the tables from which data is returned. So for simplicity, this function
 * transforms just the upper most level (the table/MV names) of the responses
 * from the gql queries.
 */
const transformMVCase = <K, S, T, U, L, V>(res: {
  mv_key_stages?: K;
  mv_subjects?: S;
  mv_tiers?: T;
  mv_units?: U;
  mv_lessons?: L;
  mv_learning_themes?: V;
}) => {
  return {
    keyStages: res.mv_key_stages,
    subjects: res.mv_subjects,
    tiers: res.mv_tiers,
    units: res.mv_units,
    lessons: res.mv_lessons,
    learningThemes: res.mv_learning_themes,
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
      themeSlug: z.string().nullable(),
      themeTitle: z.string().nullable(),
      lessonCount: z.number().nullable(),
      quizCount: z.number().nullable(),
      unitStudyOrder: z.number(),
      year: z.string(),
    })
  ),
  learningThemes: z.array(
    z
      .object({
        label: z.string(),
        tierSlug: z.string().nullable(),
        tierName: z.string().nullable(),
        subjectTitle: z.string(),
        subjectSlug: z.string(),
        slug: z.string(),
        keyStageTitle: z.string(),
        keyStageSlug: z.string(),
      })
      .nullable()
      .optional()
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
      themeSlug: z.string().nullable(),
      themeTitle: z.string().nullable(),
      quizCount: z.number().nullable().optional(), // @todo add quiz_count to MV mv_lessons
      videoCount: z.number().nullable(),
      presentationCount: z.number().nullable(),
      worksheetCount: z.number().nullable(),
      hasCopyrightMaterial: z.boolean(),
    })
  ),
});

const teachersLessonOverviewPaths = z.object({
  lessons: z.array(
    z.object({
      keyStageSlug: z.string(),
      subjectSlug: z.string(),
      unitSlug: z.string(),
      lessonSlug: z.string(),
    })
  ),
});
const teachersLessonOverviewData = z.object({
  slug: z.string(),
  title: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  coreContent: z.array(z.string().nullable()),
  contentGuidance: z.string().nullable(),
  equipmentRequired: z.string().nullable(),
  presentationUrl: z.string().nullable(),
  supervisionLevel: z.string().nullable(),
  worksheetUrl: z.string().nullable(),
  hasCopyrightMaterial: z.boolean(),
  videoMuxPlaybackId: z.string().nullable(),
  videoWithSignLanguageMuxPlaybackId: z.string().nullable(),
  transcript: z.string().nullable(),
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

export type TeachersLessonOverviewPaths = z.infer<
  typeof teachersLessonOverviewPaths
>;
export type TeachersLessonOverviewData = z.infer<
  typeof teachersLessonOverviewData
>;

const sdk = getSdk(graphqlClient);

const getFirstResultOrWarnOrFail =
  () =>
  //({ query, args }: { query: keyof typeof sdk; args: unknown }) =>
  <T>({ results }: { results: T[] }) => {
    if (results.length > 1) {
      // const warning = new OakError({
      //   code: "curriculum-api/uniqueness-assumption-violated",
      // });
      // reportError(warning, {
      //   severity: "warning",
      //   meta: {
      //     note: "meta.results has been sliced to 10 so as not to create an obscenely large pageData object",
      //     results: results.slice(10),
      //     query,
      //     args,
      //   },
      // });
    }
    const [firstResult] = results;
    if (!firstResult) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return firstResult;
  };

const curriculumApi = {
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();

    return teachersHomePageData.parse(transformMVCase(res));
  },
  teachersKeyStageSubjects: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjects>
  ) => {
    const res = await sdk.teachersKeyStageSubjects(...args);
    const { keyStages = [], subjects } = transformMVCase(res);

    const keyStage = getFirstResultOrWarnOrFail()({ results: keyStages });
    //{
    // query: "teachersKeyStageSubjects",
    // args,
    // }

    return teachersKeyStageSubjectsData.parse({
      keyStageSlug: keyStage.slug,
      keyStageTitle: keyStage.title,
      subjects,
    });
  },
  teachersKeyStageSubjectTiers: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjectTiers>
  ) => {
    const res = await sdk.teachersKeyStageSubjectTiers(...args);
    const { tiers, subjects = [], keyStages = [] } = transformMVCase(res);

    const getFirstResult = getFirstResultOrWarnOrFail();
    const keyStage = getFirstResult({ results: keyStages });
    const subject = getFirstResult({ results: subjects });

    return teachersKeyStageSubjectTiersData.parse({
      keyStageSlug: keyStage.slug,
      keyStageTitle: keyStage.title,
      subjectSlug: subject.slug,
      subjectTitle: subject.title,
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
    const {
      keyStages = [],
      subjects = [],
      tiers = [],
      units,
      learningThemes,
    } = transformMVCase(res);

    const getFirstResult = getFirstResultOrWarnOrFail();

    const keyStage = getFirstResult({ results: keyStages });
    const subject = getFirstResult({ results: subjects });
    const tier = args[0].tierSlug ? getFirstResult({ results: tiers }) : null;

    return teachersKeyStageSubjectUnitsData.parse({
      keyStageSlug: keyStage.slug,
      keyStageTitle: keyStage.title,
      subjectSlug: subject.slug,
      subjectTitle: subject.title,
      tierSlug: tier?.slug || null,
      tiers,
      units,
      learningThemes,
    });
  },
  teachersKeyStageSubjectUnitsPaths: async () => {
    const res = await sdk.teachersKeyStageSubjectUnitsPaths();
    const { subjects } = transformMVCase(res);
    return teachersKeyStageSubjectUnitsPathsSchema.parse({
      subjects,
    });
  },
  teachersKeyStageSubjectUnitLessons: async (
    ...args: Parameters<typeof sdk.teachersKeyStageSubjectUnitLessons>
  ) => {
    const res = await sdk.teachersKeyStageSubjectUnitLessons(...args);
    const { units = [], lessons = [] } = transformMVCase(res);

    const unit = getFirstResultOrWarnOrFail()({
      results: units,
    });

    return teachersKeyStageSubjectUnitsLessonsData.parse({
      ...unit,
      themeSlug: "theme slug example",
      themeTitle: "theme-slug-example",
      tierSlug: null,
      quizCount: null, // @todo
      videoCount: null, // @todo
      presentationCount: null, // @todo
      worksheetCount: null, // @todo
      lessons,
    });
  },
  teachersLessonOverviewPaths: async () => {
    const res = await sdk.teachersLessonOverviewPaths();
    return teachersLessonOverviewPaths.parse(transformMVCase(res));
  },
  teachersLessonOverview: async (
    ...args: Parameters<typeof sdk.teachersLessonOverview>
  ) => {
    const res = await sdk.teachersLessonOverview(...args);
    const { lessons = [] } = transformMVCase(res);

    const lesson = getFirstResultOrWarnOrFail()({
      results: lessons,
    });

    return teachersLessonOverviewData.parse(lesson);
  },
};

export type CurriculumApi = typeof curriculumApi;
export default curriculumApi;
