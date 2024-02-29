import { GraphQLClient } from "graphql-request";
import { z } from "zod";

import OakError from "../../errors/OakError";
import lessonListingSchema from "../curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import lessonDownloadsSchema from "../curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { programmeListingSchema } from "../curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import lessonOverviewSchema from "../curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import getServerConfig from "../getServerConfig";
import subjectListingSchema from "../curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import lessonOverviewCanonicalSchema, {
  LessonOverviewCanonical,
} from "../curriculum-api-2023/queries/lessonOverviewCanonical/lessonOverviewCanonical.schema";
import {
  lessonListSchema,
  lessonPathwaySchema,
} from "../curriculum-api-2023/shared.schema";
import lessonDownloadsCanonicalSchema, {
  LessonDownloadsCanonical,
} from "../curriculum-api-2023/queries/lessonDownloadsCanonical/lessonDownloadsCanonical.schema";
import getNextLessonsInUnit from "../curriculum-api-2023/queries/lessonDownloads/getNextLessonsInUnit";
import { pupilLessonOverviewSchema } from "../curriculum-api-2023/queries/pupilLessonOverview/pupilLessonOverview.schema";

import { transformQuiz } from "./transformQuizzes";
import { getSdk } from "./generated/sdk";

import addLegacySlugSuffix from "@/utils/slugModifiers/addLegacySlugSuffix";
import argsRemoveLegacySlugSuffix from "@/utils/slugModifiers/argsRemoveLegacySlugSuffix";
import { LEGACY_COHORT } from "@/config/cohort";

const curriculumApiUrl = getServerConfig("curriculumApiUrl");
const curriculumApiAuthType = getServerConfig("curriculumApiAuthType");
const curriculumApiAuthKey = getServerConfig("curriculumApiAuthKey");

/**
 * 'Admin secret' for local development only.
 * Basically we should be able to use auth-type and auth-key for both local and
 * cloud authentication (according to Thomas) but locally it's not working so
 * need to use admin-secret instead.
 */
const curriculumApiAdminSecret = process.env.CURRICULUM_API_ADMIN_SECRET;

/**
 * TS complaining when Headers in not typed.
 */
type Headers =
  | { "x-hasura-admin-secret": string }
  | { "x-oak-auth-type": string; "x-oak-auth-key": string };
const headers: Headers = curriculumApiAdminSecret
  ? {
      "x-hasura-admin-secret": curriculumApiAdminSecret,
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
const transformMVCase = <K, S, T, U, L, V, W, R1, R2, P, Q>(res: {
  mv_key_stages?: K;
  mv_subjects?: S;
  mv_tiers?: T;
  mv_units?: U;
  mv_lessons?: L;
  mv_learning_themes?: V;
  mv_downloads?: W;
  mv_programmes_unavailable?: R1;
  mv_programmes_available?: R2;
  mv_programmes?: P;
  mv_share?: Q;
}) => {
  return {
    keyStages: res.mv_key_stages,
    subjects: res.mv_subjects,
    tiers: res.mv_tiers,
    units: res.mv_units,
    lessons: res.mv_lessons,
    learningThemes: res.mv_learning_themes,
    downloads: res.mv_downloads,
    programmesUnavailable: res.mv_programmes_unavailable,
    programmesAvailable: res.mv_programmes_available,
    programmes: res.mv_programmes,
    shareableResources: res.mv_share,
  };
};

const unitData = z.object({
  slug: z.string(),
  title: z.string(),
  nullTitle: z.string(),
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  themeSlug: z.string().nullable(),
  themeTitle: z.string().nullable(),
  lessonCount: z.number().nullable(),
  quizCount: z.number().nullable(),
  unitStudyOrder: z.number(),
  expired: z.boolean().nullable(),
  expiredLessonCount: z.number().nullable(),
  yearTitle: z.string().nullable(),
  cohort: z.string().nullish(),
  learningThemes: z
    .array(
      z.object({
        themeSlug: z.string().nullable(),
        themeTitle: z.string().nullable(),
      }),
    )
    .nullable(),
});

const unitsData = z.array(z.array(unitData));

const tiersData = z.array(
  z.object({
    tierSlug: z.string(),
    tierTitle: z.string(),
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullable().optional(),
    lessonCount: z.number().nullable().optional(),
  }),
);

const keyStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortCode: z.string(),
  displayOrder: z.number().optional(),
});

const subjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

const contentTypesSchema = z.object({
  slug: z.union([z.literal("unit"), z.literal("lesson")]),
  title: z.union([z.literal("Units"), z.literal("Lessons")]),
});

const searchPageData = z.object({
  keyStages: z.array(keyStageSchema),
  subjects: z.array(subjectSchema),
  contentTypes: z.array(contentTypesSchema),
});

const teachersHomePageData = z.object({
  keyStages: z.array(keyStageSchema),
});

export const lessonOverviewData = lessonOverviewSchema;
export const pupilLessonOverviewData = pupilLessonOverviewSchema;

export const programmesData = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  activeLessonCount: z.number(),
  nonDuplicateSubjectLessonCount: z.number().optional(),
  nonDuplicateSubjectUnitCount: z.number().optional(),
  totalUnitCount: z.number(),
  activeUnitCount: z.number(),
  programmeSlug: z.string(),
  tierSlug: z.string().nullable(),
  tierTitle: z.string().nullable().optional(),
  lessonCount: z.number().optional(),
  unitCount: z.number().optional(),
});

const programmesArray = z.array(programmesData);

export const subjectListingData = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjects: z.array(programmesData),
  subjectsUnavailable: z.array(programmesData),
  keyStages: z.array(keyStageSchema).optional(),
});

const unitListingData = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  totalUnitCount: z.number(),
  tiers: tiersData,
  units: unitsData,
  hasNewContent: z.boolean().nullish(),
  learningThemes: z
    .array(
      z.object({
        themeTitle: z.string().nullable(),
        themeSlug: z.string().nullable(),
      }),
    )
    .nullable(),
});

const tierListingData = z.object({
  programmes: z.array(programmesData),
});

const lessonShareListSchema = z.object({
  exists: z.boolean().nullable(),
  type: z.enum([
    "intro-quiz-questions",
    "exit-quiz-questions",
    "worksheet-pdf",
    "video",
  ]),
  label: z.string(),
  metadata: z.string(),
});

export const lessonShareSchema = z.intersection(
  lessonPathwaySchema,
  z.object({
    isLegacy: z.boolean(),
    lessonSlug: z.string(),
    lessonTitle: z.string(),
    shareableResources: z.array(lessonShareListSchema),
    expired: z.boolean().nullable(),
  }),
);

export type SearchPageData = z.infer<typeof searchPageData>;
export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;
export type LessonOverviewData = z.infer<typeof lessonOverviewData>;
export type PupilLessonOverviewData = z.infer<typeof pupilLessonOverviewData>;
export type LessonDownloadsData = z.infer<typeof lessonDownloadsSchema>;
export type LessonShareData = z.infer<typeof lessonShareSchema>;
export type LessonShareSchema = z.infer<typeof lessonShareListSchema>;
export type ProgrammesData = z.infer<typeof programmesData>;
export type SubjectListingData = z.infer<typeof subjectListingData>;
export type UnitListingData = z.infer<typeof unitListingData>;
export type TierListingData = z.infer<typeof tierListingData>;
export type UnitData = z.infer<typeof unitData>;
export type LessonShareListData = z.infer<typeof lessonShareListSchema>;

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

export const getFirstResultOrNull =
  () =>
  <T>({ results }: { results: T[] }) => {
    const [firstResult] = results;
    if (!firstResult) {
      return null;
    }

    return firstResult;
  };

export const filterOutDuplicateProgrammesOrNull = (
  programmesAvailable: ProgrammesData[],
  programmesUnavailable: ProgrammesData[],
) => {
  return programmesUnavailable.filter(
    (unavailable) =>
      !programmesAvailable.some(
        (available) => available.subjectSlug === unavailable.subjectSlug,
      ),
  );
};

const curriculumApi = {
  searchPage: async () => {
    const res = await sdk.searchPage();

    const { keyStages, programmesAvailable } = transformMVCase(res);

    const keyStageSlugs = keyStages?.map((keyStage) => keyStage.slug);

    const filteredByActiveKeyStages = programmesAvailable?.filter(
      (subject) => keyStageSlugs?.includes(subject.keyStageSlug),
    );
    const uniqueProgrammes = filteredByActiveKeyStages?.filter(
      (subject, index, self) => {
        return index === self.findIndex((s) => s.slug === subject.slug);
      },
    );

    return searchPageData.parse({
      keyStages,
      subjects: uniqueProgrammes,
      contentTypes: [
        { slug: "unit", title: "Units" },
        { slug: "lesson", title: "Lessons" },
      ],
    });
  },
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();

    return teachersHomePageData.parse(transformMVCase(res));
  },
  subjectListing: async (...args: Parameters<typeof sdk.subjectListing>) => {
    const res = await sdk.subjectListing(...args);
    const { keyStages = [], programmesAvailable } = transformMVCase(res);

    const keyStage = getFirstResultOrWarnOrFail()({ results: keyStages });
    const keyStageList = res.keyStageList;

    const addCurriculum2023Counts = (
      programmes: ProgrammesData[] | undefined,
    ) => {
      return programmes
        ? programmes.map((programme) => {
            return {
              programmeSlug: addLegacySlugSuffix(programme.programmeSlug),
              subjectSlug: addLegacySlugSuffix(programme.subjectSlug),
              subjectTitle: programme.subjectTitle,
              lessonCount: programme.nonDuplicateSubjectLessonCount,
              unitCount: programme.nonDuplicateSubjectUnitCount,
              programmeCount:
                programmes.filter(
                  (subject) => subject.subjectSlug === programme.subjectSlug,
                ).length || 0,
            };
          })
        : [];
    };

    return subjectListingSchema.parse({
      keyStageSlug: keyStage.slug,
      keyStageTitle: keyStage.title,
      keyStages: keyStageList,
      subjects:
        addCurriculum2023Counts(programmesArray.parse(programmesAvailable)) ||
        [],
    });
  },
  unitListing: async (...args: Parameters<typeof sdk.unitListing>) => {
    const res = await sdk.unitListing(...argsRemoveLegacySlugSuffix(args));
    const { units = [], programmes = [], tiers = [] } = transformMVCase(res);

    const unitsWithVariants = units.map((unit) => {
      const learningThemes = [
        {
          themeTitle: unit.themeTitle,
          themeSlug: unit.themeSlug,
        },
      ];
      const nullTitle = unit.title;
      return [
        {
          ...unit,
          programmeSlug: addLegacySlugSuffix(unit.programmeSlug),
          nullTitle,
          learningThemes,
        },
      ];
    });

    const legacyTiers = tiers.map((tier) => {
      return {
        ...tier,
        tierProgrammeSlug: addLegacySlugSuffix(tier.tierProgrammeSlug),
      };
    });

    const programme = getFirstResultOrWarnOrFail()({ results: programmes });
    const learningThemes = unitsWithVariants.map((unitWithTheme) => ({
      themeSlug: unitWithTheme[0]?.themeSlug,
      themeTitle: unitWithTheme[0]?.themeTitle || "No theme",
    }));

    const filteredDuplicatedLearningThemes = [
      ...new Map(
        learningThemes.map((theme) => [JSON.stringify(theme), theme]),
      ).values(),
    ].sort((a, b) => {
      if (a.themeTitle < b.themeTitle) {
        return -1;
      }
      if (a.themeTitle > b.themeTitle) {
        return 1;
      }
      return 0;
    });

    return unitListingData.parse({
      programmeSlug: addLegacySlugSuffix(programme?.programmeSlug),
      keyStageSlug: programme?.keyStageSlug,
      keyStageTitle: programme?.keyStageTitle,
      examBoardSlug: null,
      examBoardTitle: null,
      subjectSlug: programme?.subjectSlug,
      subjectTitle: programme?.subjectTitle,
      totalUnitCount: programme?.totalUnitCount,
      tierSlug: programme?.tierSlug || null,
      learningThemes: filteredDuplicatedLearningThemes,
      tiers: legacyTiers,
      units: unitsWithVariants,
    });
  },
  lessonOverview: async (...args: Parameters<typeof sdk.lessonOverview>) => {
    const res = await sdk.lessonOverview(...argsRemoveLegacySlugSuffix(args));
    const { lessons = [] } = transformMVCase(res);

    const { introQuiz, exitQuiz } = res;

    // Transform quizzes here because the schema is not the same as the one returned by the API
    const introQuizTransformed =
      introQuiz && introQuiz.length > 0 ? transformQuiz(introQuiz) : null;

    const exitQuizTransformed =
      exitQuiz && exitQuiz.length > 0 ? transformQuiz(exitQuiz) : null;

    const lesson = getFirstResultOrWarnOrFail()({
      results: lessons,
    });

    const lessonKeyLearningPoints = lesson.coreContent?.map(
      (content: string) => {
        return { keyLearningPoint: content };
      },
    );

    const lessonEquipmentAndResources = lesson.equipmentRequired
      ? [{ equipment: lesson.equipmentRequired }]
      : null;

    const lessonContentGuidance = lesson.contentGuidance
      ? [
          {
            contentGuidanceLabel: lesson.contentGuidance,
            contentGuidanceDescription: lesson.contentGuidance,
            contentGuidanceArea: "contentGuidanceArea",
          },
        ]
      : null;

    return lessonOverviewData.parse({
      ...lesson,
      programmeSlug: addLegacySlugSuffix(lesson.programmeSlug),
      misconceptionAndCommonMistakes: null,
      lessonEquipmentAndResources: lessonEquipmentAndResources,
      teacherTips: null,
      keyLearningPoints: lessonKeyLearningPoints,
      pupilLessonOutcome: null,
      lessonKeywords: null,
      copyRightContent: null,
      additionalMaterialUrl: null,
      contentGuidance: lessonContentGuidance,
      yearTitle: "",
      starterQuiz: introQuizTransformed,
      exitQuiz: exitQuizTransformed,
      isLegacy: true,
    });
  },
  lessonOverviewCanonical: async (
    ...args: Parameters<typeof sdk.lessonOverviewCanonical>
  ) => {
    const res = await sdk.lessonOverviewCanonical(...args);
    const { lessons = [] } = transformMVCase(res);

    const { introQuiz, exitQuiz } = res;

    // Transform quizzes here because the schema is not the same as the one returned by the API
    const introQuizTransformed =
      introQuiz && introQuiz.length > 0 ? transformQuiz(introQuiz) : null;

    const exitQuizTransformed =
      exitQuiz && exitQuiz.length > 0 ? transformQuiz(exitQuiz) : null;

    const transformedLessons = lessons.map((lesson) => {
      const lessonKeyLearningPoints = lesson.coreContent?.map(
        (content: string) => {
          return { keyLearningPoint: content };
        },
      );

      const lessonEquipmentAndResources = lesson.equipmentRequired
        ? [{ equipment: lesson.equipmentRequired }]
        : null;

      const lessonContentGuidance = lesson.contentGuidance
        ? [
            {
              contentGuidanceLabel: lesson.contentGuidance,
              contentGuidanceDescription: lesson.contentGuidance,
              contentGuidanceArea: "contentGuidanceArea",
            },
          ]
        : null;

      return {
        ...lesson,
        programmeSlug: addLegacySlugSuffix(lesson.programmeSlug),
        misconceptionAndCommonMistakes: null,
        lessonEquipmentAndResources: lessonEquipmentAndResources,
        teacherTips: null,
        keyLearningPoints: lessonKeyLearningPoints,
        pupilLessonOutcome: null,
        lessonKeywords: null,
        copyRightContent: null,
        additionalMaterialUrl: null,
        contentGuidance: lessonContentGuidance,
        yearTitle: "",
        starterQuiz: introQuizTransformed,
        exitQuiz: exitQuizTransformed,
        isLegacy: true,
      };
    });

    const lessonWithPathways = transformedLessons.reduce(
      (acc, lesson) => {
        const pathway = lessonPathwaySchema.parse(lesson);
        return {
          ...acc,
          pathways: [...acc.pathways, pathway],
        };
      },
      {
        ...transformedLessons[0],
        pathways: [],
        isLegacy: true,
      } as LessonOverviewCanonical,
    );

    return lessonOverviewCanonicalSchema.parse(lessonWithPathways);
  },
  lessonListing: async (...args: Parameters<typeof sdk.lessonListing>) => {
    const res = await sdk.lessonListing(...argsRemoveLegacySlugSuffix(args));
    const { units = [], lessons = [] } = transformMVCase(res);

    const unit = getFirstResultOrWarnOrFail()({
      results: units,
    });

    const lessonsWithModifiedProgrammeSlug = lessons.map((lesson) => {
      return {
        ...lesson,
        programmeSlug: addLegacySlugSuffix(lesson.programmeSlug),
      };
    });

    return lessonListingSchema.parse({
      ...unit,
      programmeSlug: addLegacySlugSuffix(unit.programmeSlug),
      lessons: lessonsWithModifiedProgrammeSlug,
    });
  },
  lessonShare: async (...args: Parameters<typeof sdk.lessonShare>) => {
    const res = await sdk.lessonShare(...argsRemoveLegacySlugSuffix(args));
    const { shareableResources = [] } = transformMVCase(res);

    const share = getFirstResultOrWarnOrFail()({
      results: shareableResources,
    });

    return lessonShareSchema.parse({
      ...share,
      expired: false,
      programmeSlug: addLegacySlugSuffix(share.programmeSlug),
      isLegacy: true,
      lessonCohort: LEGACY_COHORT,
    });
  },
  lessonDownloads: async (...args: Parameters<typeof sdk.lessonDownloads>) => {
    const res = await sdk.lessonDownloads(...argsRemoveLegacySlugSuffix(args));
    const { downloads = [], lessons = [] } = transformMVCase(res);

    const download = getFirstResultOrWarnOrFail()({
      results: downloads,
    });

    const unit = lessonListSchema.parse(lessons);

    const nextLessons = getNextLessonsInUnit(unit, args[0].lessonSlug);

    return lessonDownloadsSchema.parse({
      ...download,
      expired: false,
      nextLessons,
      programmeSlug: addLegacySlugSuffix(download.programmeSlug),
      isLegacy: true,
      hasDownloadableResources: true,
    });
  },
  lessonDownloadsCanonical: async (
    ...args: Parameters<typeof sdk.lessonDownloadsCanonical>
  ) => {
    const res = await sdk.lessonDownloadsCanonical(...args);
    const { downloads = [] } = transformMVCase(res);

    const lessonDownloadsWithPathways = downloads.reduce(
      (acc, lesson) => {
        const pathway = lessonPathwaySchema.parse(lesson);
        return {
          ...acc,
          pathways: [...acc.pathways, pathway],
        };
      },
      {
        ...downloads[0],
        expired: false,
        pathways: [],
        isLegacy: true,
        hasDownloadableResources: true,
      } as LessonDownloadsCanonical,
    );

    return lessonDownloadsCanonicalSchema.parse(lessonDownloadsWithPathways);
  },
  tierListing: async (...args: Parameters<typeof sdk.tierListing>) => {
    const res = await sdk.tierListing(...argsRemoveLegacySlugSuffix(args));
    const { programmes = [] } = transformMVCase(res);

    const tierListingToProgrammeListing2013 = tierListingData
      .parse({ programmes })
      .programmes.map((programme) => {
        return {
          programmes: {
            subjectSlug: addLegacySlugSuffix(programme.subjectSlug),
            subjectTitle: programme.subjectTitle,
            keyStageSlug: programme.keyStageSlug,
            keyStageTitle: programme.keyStageTitle,
            programmes: programmes.map((programme) => {
              return {
                programmeSlug: addLegacySlugSuffix(programme.programmeSlug),
                subjectTitle: programme.subjectTitle,
                unitCount: programme.totalUnitCount,
                lessonCount: programme.activeLessonCount,
                tierSlug: programme.tierSlug,
                tierTitle: programme.tierTitle,
                tierDisplayOrder: null,
                examBoardSlug: null,
                examBoardTitle: null,
                examBoardDisplayOrder: null,
              };
            }),
          },
        };
      });

    const result = getFirstResultOrWarnOrFail()({
      results: tierListingToProgrammeListing2013,
    });

    return programmeListingSchema.parse(result.programmes);
  },
};

export type CurriculumApi = typeof curriculumApi;
export default curriculumApi;
