import { GraphQLClient } from "graphql-request";
import { z } from "zod";

//import errorReporter from "../../common-lib/error-reporter";
import config from "../../config/server";
import OakError from "../../errors/OakError";
import lessonListingSchema from "../curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import lessonDownloadsSchema from "../curriculum-api-2023/queries/downloads/downloads.schema";

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

const unitsData = z.array(
  z.object({
    slug: z.string(),
    title: z.string(),
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
  })
);

const tiersData = z.array(
  z.object({
    tierSlug: z.string(),
    tierTitle: z.string(),
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullable(),
    lessonCount: z.number().nullable(),
  })
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

const lessonListingPaths = z.object({
  units: z.array(
    z.object({
      programmeSlug: z.string(),
      unitSlug: z.string(),
    })
  ),
});

const lessonOverviewQuizData = z.array(
  z.object({
    keyStageSlug: z.string(),
    keyStageTitle: z.string(),
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    unitSlug: z.string(),
    unitTitle: z.string(),
    order: z.number().nullable().optional(),
    title: z.string().nullable().optional(),
    points: z.number().nullable().optional(),
    required: z.boolean().nullable(),
    choices: z.array(
      z.object({
        choice: z.string(),
        image: z.string().nullable(),
      })
    ),
    active: z.boolean(),
    answer: z.union([z.array(z.string()), z.string()]),
    type: z.string(),
    quizType: z.string(),
    images: z
      .array(
        z.union([
          z.object({
            title: z.string().nullable(),
            images: z.array(z.string()),
          }),
          z.string(),
        ])
      )
      .nullable(),
    feedbackCorrect: z.string().nullable(),
    feedbackIncorrect: z.string().nullable(),
    displayNumber: z.string().nullable(),
  })
);

const lessonQuizInfoData = z
  .object({
    title: z.string(),
    questionCount: z.number(),
  })
  .nullable();

const lessonOverviewPaths = z.object({
  lessons: z.array(
    z.object({
      programmeSlug: z.string(),
      unitSlug: z.string(),
      lessonSlug: z.string(),
    })
  ),
});

const lessonDownloadPaths = z.object({
  downloads: z.array(
    z.object({
      programmeSlug: z.string(),
      unitSlug: z.string(),
      lessonSlug: z.string(),
    })
  ),
});

const lessonOverviewData = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  programmeSlug: z.string(),
  unitTitle: z.string(),
  unitSlug: z.string(),
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
  isWorksheetLandscape: z.boolean(),
  hasCopyrightMaterial: z.boolean(),
  videoMuxPlaybackId: z.string().nullable(),
  videoWithSignLanguageMuxPlaybackId: z.string().nullable(),
  transcriptSentences: z.array(z.string()).nullable(),
  hasDownloadableResources: z.boolean().nullable(),
  introQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  introQuizInfo: lessonQuizInfoData,
  exitQuizInfo: lessonQuizInfoData,
  expired: z.boolean(),
});

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
});

const unitListingPaths = z.object({
  programmes: z.array(
    z.object({
      programmeSlug: z.string(),
    })
  ),
});

const unitListingData = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  totalUnitCount: z.number(),
  tiers: tiersData,
  units: unitsData,
  learningThemes: z.array(
    z.object({
      learningThemeTitle: z.string().nullable(),
      learningThemeSlug: z.string().nullable(),
    })
  ),
});

const programmeListingPaths = z.object({
  programmes: z.array(
    z.object({
      subjectSlug: z.string(),
      keyStageSlug: z.string(),
    })
  ),
});

const tierListingData = z.object({
  programmes: z.array(programmesData),
});

export type SearchPageData = z.infer<typeof searchPageData>;
export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;
export type LessonListingPaths = z.infer<typeof lessonListingPaths>;
export type LessonOverviewPaths = z.infer<typeof lessonOverviewPaths>;
export type LessonOverviewData = z.infer<typeof lessonOverviewData>;
export type LessonDownloadsData = z.infer<typeof lessonDownloadsSchema>;
export type LessonDownloadPaths = z.infer<typeof lessonDownloadPaths>;
export type ProgrammesData = z.infer<typeof programmesData>;
export type SubjectListingData = z.infer<typeof subjectListingData>;
export type UnitListingPaths = z.infer<typeof unitListingPaths>;
export type UnitListingData = z.infer<typeof unitListingData>;
export type ProgrammeListingPaths = z.infer<typeof programmeListingPaths>;
export type TierListingData = z.infer<typeof tierListingData>;

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
  programmesUnavailable: ProgrammesData[]
) => {
  return programmesUnavailable.filter(
    (unavailable) =>
      !programmesAvailable.some(
        (available) => available.subjectSlug === unavailable.subjectSlug
      )
  );
};

const curriculumApi = {
  searchPage: async () => {
    const res = await sdk.searchPage();

    const { keyStages, programmesAvailable } = transformMVCase(res);

    const keyStageSlugs = keyStages?.map((keyStage) => keyStage.slug);

    const filteredByActiveKeyStages = programmesAvailable?.filter((subject) =>
      keyStageSlugs?.includes(subject.keyStageSlug)
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
    const {
      keyStages = [],
      programmesAvailable,
      programmesUnavailable,
    } = transformMVCase(res);

    const keyStage = getFirstResultOrWarnOrFail()({ results: keyStages });

    const filteredUnavailableProgrammeDuplicate =
      filterOutDuplicateProgrammesOrNull(
        programmesArray.parse(programmesAvailable),
        programmesArray.parse(programmesUnavailable)
      );

    const addCurriculum2023Counts = (
      programmes: ProgrammesData[] | undefined
    ) => {
      return programmes
        ? programmes.map((programme) => {
            return {
              ...programme,
              lessonCount: programme.nonDuplicateSubjectLessonCount,
              unitCount: programme.nonDuplicateSubjectUnitCount,
            };
          })
        : [];
    };

    return subjectListingData.parse({
      keyStageSlug: keyStage.slug,
      keyStageTitle: keyStage.title,
      subjects:
        addCurriculum2023Counts(programmesArray.parse(programmesAvailable)) ||
        [],
      subjectsUnavailable:
        addCurriculum2023Counts(
          programmesArray.parse(filteredUnavailableProgrammeDuplicate)
        ) || [],
    });
  },
  unitListingPaths: async () => {
    const res = await sdk.unitListingPaths();
    const { programmes } = transformMVCase(res);
    return unitListingPaths.parse({
      programmes,
    });
  },
  unitListing: async (...args: Parameters<typeof sdk.unitListing>) => {
    const res = await sdk.unitListing(...args);
    const { units = [], programmes = [], tiers = [] } = transformMVCase(res);

    const programme = getFirstResultOrWarnOrFail()({ results: programmes });
    const learningThemes = units.map((unitWithTheme) => ({
      learningThemeSlug: unitWithTheme?.themeSlug,
      learningThemeTitle: unitWithTheme?.themeTitle || "No theme",
    }));

    // !Refactor index signature to be more specific

    const filteredDuplicatedLearningThemes = [
      ...new Map(
        learningThemes.map((theme) => [JSON.stringify(theme), theme])
      ).values(),
    ].sort((a, b) => {
      if (a.learningThemeTitle < b.learningThemeTitle) {
        return -1;
      }
      if (a.learningThemeTitle > b.learningThemeTitle) {
        return 1;
      }
      return 0;
    });

    return unitListingData.parse({
      programmeSlug: programme?.programmeSlug,
      keyStageSlug: programme?.keyStageSlug,
      keyStageTitle: programme?.keyStageTitle,
      subjectSlug: programme?.subjectSlug,
      subjectTitle: programme?.subjectTitle,
      totalUnitCount: programme?.totalUnitCount,
      tierSlug: programme?.tierSlug || null,
      learningThemes: filteredDuplicatedLearningThemes,
      tiers,
      units,
    });
  },
  lessonOverviewPaths: async () => {
    const res = await sdk.lessonOverviewPaths();
    return lessonOverviewPaths.parse(transformMVCase(res));
  },
  lessonOverview: async (...args: Parameters<typeof sdk.lessonOverview>) => {
    const res = await sdk.lessonOverview(...args);
    const { lessons = [] } = transformMVCase(res);
    const { introQuiz, exitQuiz, exitQuizInfo = [], introQuizInfo = [] } = res;

    const lesson = getFirstResultOrWarnOrFail()({
      results: lessons,
    });

    const exitQuizInfoSingle = getFirstResultOrNull()({
      results: exitQuizInfo,
    });

    const introQuizInfoSingle = getFirstResultOrNull()({
      results: introQuizInfo,
    });
    return lessonOverviewData.parse({
      ...lesson,
      introQuizInfo: introQuizInfoSingle,
      exitQuizInfo: exitQuizInfoSingle,
      introQuiz,
      exitQuiz,
    });
  },
  lessonListingPaths: async () => {
    const res = await sdk.lessonListingPaths();
    const { units = [] } = transformMVCase(res);
    return lessonListingPaths.parse({
      units,
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
  lessonDownloadPaths: async () => {
    const res = await sdk.lessonDownloadPaths();
    return lessonDownloadPaths.parse(transformMVCase(res));
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
  programmeListingPaths: async () => {
    const res = await sdk.programmeListingPaths();
    return programmeListingPaths.parse(transformMVCase(res));
  },
  tierListing: async (...args: Parameters<typeof sdk.tierListing>) => {
    const res = await sdk.tierListing(...args);
    const { programmes = [] } = transformMVCase(res);

    return tierListingData.parse({ programmes });
  },
};

export type CurriculumApi = typeof curriculumApi;
export default curriculumApi;
