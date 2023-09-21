import { GraphQLClient } from "graphql-request";
import { z } from "zod";

import OakError from "../../errors/OakError";
import lessonListingSchema from "../curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import lessonDownloadsSchema from "../curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { programmeListingSchema } from "../curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import lessonOverviewSchema from "../curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import getServerConfig from "../getServerConfig";
import subjectListingSchema from "../curriculum-api-2023/queries/subjectListing/subjectListing.schema";

import { transformQuiz } from "./transformQuizzes";
import { getSdk } from "./generated/sdk";

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
const transformMVCase = <K, S, T, U, L, V, W, R1, R2, P>(res: {
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

export type SearchPageData = z.infer<typeof searchPageData>;
export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;
export type LessonOverviewData = z.infer<typeof lessonOverviewData>;
export type LessonDownloadsData = z.infer<typeof lessonDownloadsSchema>;
export type ProgrammesData = z.infer<typeof programmesData>;
export type SubjectListingData = z.infer<typeof subjectListingData>;
export type UnitListingData = z.infer<typeof unitListingData>;
export type TierListingData = z.infer<typeof tierListingData>;
export type UnitData = z.infer<typeof unitData>;

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
    const uniqueProgrammes = filteredByActiveKeyStages
      ?.filter((subject, index, self) => {
        return index === self.findIndex((s) => s.slug === subject.slug);
      })
      .filter((subject) => subject.slug !== "physics"); // I don't know why physics is in programmesAvailable

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
              programmeSlug: programme.programmeSlug,
              subjectSlug: programme.subjectSlug,
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
    const res = await sdk.unitListing(...args);
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
          nullTitle,
          learningThemes,
        },
      ];
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
      programmeSlug: programme?.programmeSlug,
      keyStageSlug: programme?.keyStageSlug,
      keyStageTitle: programme?.keyStageTitle,
      examBoardSlug: null,
      examBoardTitle: null,
      subjectSlug: programme?.subjectSlug,
      subjectTitle: programme?.subjectTitle,
      totalUnitCount: programme?.totalUnitCount,
      tierSlug: programme?.tierSlug || null,
      learningThemes: filteredDuplicatedLearningThemes,
      tiers,
      units: unitsWithVariants,
    });
  },
  lessonOverview: async (...args: Parameters<typeof sdk.lessonOverview>) => {
    const res = await sdk.lessonOverview(...args);
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
      lessonTitle: lesson.lessonTitle,
      lessonSlug: lesson.lessonSlug,
      programmeSlug: lesson.programmeSlug,
      unitSlug: lesson.unitSlug,
      unitTitle: lesson.unitTitle,
      keyStageSlug: lesson.keyStageSlug,
      keyStageTitle: lesson.keyStageTitle,
      subjectSlug: lesson.subjectSlug,
      subjectTitle: lesson.subjectTitle,
      misconceptionAndCommonMistakes: null,
      lessonEquipmentAndResources: lessonEquipmentAndResources,
      teacherTips: null,
      keyLearningPoints: lessonKeyLearningPoints,
      pupilLessonOutcome: null,
      lessonKeywords: null,
      copyRightContent: null,
      additionalMaterialUrl: null,
      contentGuidance: lessonContentGuidance,
      supervisionLevel: lesson.supervisionLevel,
      worksheetUrl: lesson.worksheetUrl,
      isWorksheetLandscape: lesson.isWorksheetLandscape,
      presentationUrl: lesson.presentationUrl,
      hasCopyrightMaterial: lesson.hasCopyrightMaterial,
      videoMuxPlaybackId: lesson.videoMuxPlaybackId,
      videoWithSignLanguageMuxPlaybackId:
        lesson.videoWithSignLanguageMuxPlaybackId,
      transcriptSentences: lesson.transcriptSentences,
      hasDownloadableResources: lesson.hasDownloadableResources,
      expired: lesson.expired,
      yearTitle: "",
      starterQuiz: introQuizTransformed,
      exitQuiz: exitQuizTransformed,
    });
  },
  lessonListing: async (...args: Parameters<typeof sdk.lessonListing>) => {
    const res = await sdk.lessonListing(...args);
    const { units = [], lessons = [] } = transformMVCase(res);

    const unit = getFirstResultOrWarnOrFail()({
      results: units,
    });

    return lessonListingSchema.parse({
      ...unit,
      lessons,
    });
  },
  lessonDownloads: async (...args: Parameters<typeof sdk.lessonDownloads>) => {
    const res = await sdk.lessonDownloads(...args);
    const { downloads = [] } = transformMVCase(res);

    const download = getFirstResultOrWarnOrFail()({
      results: downloads,
    });

    return lessonDownloadsSchema.parse({
      ...download,
    });
  },
  tierListing: async (...args: Parameters<typeof sdk.tierListing>) => {
    const res = await sdk.tierListing(...args);
    const { programmes = [] } = transformMVCase(res);

    const tierListingToProgrammeListing2013 = tierListingData
      .parse({ programmes })
      .programmes.map((programme) => {
        return {
          programmes: {
            subjectSlug: programme.subjectSlug,
            subjectTitle: programme.subjectTitle,
            keyStageSlug: programme.keyStageSlug,
            keyStageTitle: programme.keyStageTitle,
            programmes: programmes.map((programme) => {
              return {
                programmeSlug: programme.programmeSlug,
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
