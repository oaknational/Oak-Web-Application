import { BatchResult, Sdk, getBatchedRequests } from "../../sdk";
import {
  SpecialistLessonCountDocument,
  DevelopmentStageUnitCountDocument,
} from "../../generated/sdk";
import { sortByDevelopmentStage } from "../specialistProgrammeListing/specialistProgrammeListing.query";

import {
  BatchResultResponseArray,
  DevelopmentStage,
  DevelopmentStageCombinedProgrammeFields,
  SpecialistUnitListRequestSchema,
  SpecialistUnitListingData,
  batchResultResponseArray,
  developmentStageCombinedProgrammeFields,
  developmentStageUnitCount,
  specialistUnitLessonCount,
  specialistUnitListRequestSchema,
  specialistUnitListingSchema,
} from "./specialistUnitListing.schema";

import OakError from "@/errors/OakError";

export const getExpandedSpecialistUnits = (
  specialistUnits: SpecialistUnitListRequestSchema,
  data: BatchResultResponseArray,
) => {
  const units = specialistUnits.map((unit, i) => {
    const batchRes = specialistUnitLessonCount.parse(data[i]?.data);
    const lessonCount = batchRes.specialistUnitLessonCount.aggregate.count;
    const expiredLessonCount =
      batchRes.specialistUnitExpiredLessonCount.aggregate.count;
    const expired =
      unit.expired ||
      lessonCount === 0 ||
      lessonCount - expiredLessonCount === 0;

    if (data[i]?.data) {
      return [
        {
          title: unit.unit_title,
          slug: unit.unit_slug,
          lessonCount,
          nullTitle: unit.unit_title,
          programmeSlug: unit.synthetic_programme_slug,
          subjectSlug: unit.combined_programme_fields.subject_slug,
          subjectTitle: unit.combined_programme_fields.subject,
          expired,
          expiredLessonCount,
          unpublishedLessonCount: 0,
          themeSlug: unit.threads ? unit.threads[0]?.themeSlug : null,
          themeTitle: unit.threads ? unit.threads[0]?.themeTitle : null,
          learningThemes: [
            {
              themeSlug: unit.threads ? unit.threads[0]?.themeSlug : null,
              themeTitle: unit.threads ? unit.threads[0]?.themeTitle : null,
            },
          ],
          developmentStageSlug:
            unit.combined_programme_fields.developmentstage_slug || null,
          developmentStageTitle:
            unit.combined_programme_fields.developmentstage || null,
          orderInProgramme: unit.order_in_programme,
        },
      ];
    }
  });

  return units;
};

export const getExpandedDevelopmentStages = (
  partialDevelopmentStages: Array<Partial<DevelopmentStage>>,
  data: BatchResultResponseArray,
) => {
  return partialDevelopmentStages.map((stage, i) => {
    const batchRes = developmentStageUnitCount.parse(data[i]?.data);
    if (data[i]?.data) {
      return {
        ...stage,
        unitCount: batchRes.developmentStageUnitCount.aggregate.count,
        lessonCount: batchRes.developmentStageLessonCount.aggregate.count,
      };
    }
  });
};

export const getUnitBatchRequests = (
  specialistUnits: SpecialistUnitListRequestSchema,
) => {
  return specialistUnits.map((c) => {
    return {
      document: SpecialistLessonCountDocument,
      variables: { unit_slug: c.unit_slug },
    };
  });
};

export const getDevelopmentStagesBatchRequests = (
  developmentStages: Partial<DevelopmentStage>[],
) => {
  return developmentStages.map((c) => {
    return {
      document: DevelopmentStageUnitCountDocument,
      variables: {
        syntheticProgrammeSlug: c?.programmeSlug,
      },
    };
  });
};

export const getThemes = (specialistUnits: SpecialistUnitListRequestSchema) => {
  return specialistUnits.reduce(
    (acc, unit) => {
      const themeSlug = unit.threads?.[0]?.themeSlug || null;
      const themeTitle = unit.threads?.[0]?.themeTitle || null;
      if (
        themeSlug &&
        themeTitle &&
        !acc.find((t) => t?.themeSlug === themeSlug)
      ) {
        const theme = {
          themeSlug: themeSlug,
          themeTitle: themeTitle,
        };
        acc.push(theme);
      }
      return acc;
    },
    [] as SpecialistUnitListingData["learningThemes"],
  );
};

export const getPartialDevelopmentStageArray = (
  developmentStages: DevelopmentStageCombinedProgrammeFields,
) => {
  return sortByDevelopmentStage(developmentStages).reduce(
    (acc, stage) => {
      const stageSlug = stage.combined_programme_fields.developmentstage_slug;
      const stageTitle = stage.combined_programme_fields.developmentstage;
      if (stageSlug && stageTitle && !acc.find((s) => s?.slug === stageSlug)) {
        const developmentStage = {
          slug: stageSlug,
          title: stageTitle,
          programmeSlug: stage.synthetic_programme_slug,
        };
        acc.push(developmentStage);
      }
      return acc;
    },
    [] as Array<Partial<DevelopmentStage>>,
  );
};

export const getUnitListingPageData = (
  data: BatchResult,
  specialistUnits: SpecialistUnitListRequestSchema,
  partialDevelopmentStages: Array<Partial<DevelopmentStage>>,
) => {
  const parsedData = batchResultResponseArray.parse(data);

  const specialistData = parsedData.filter(
    (item) => "specialistUnitLessonCount" in item.data,
  );
  const developmentData = parsedData.filter(
    (item) => "developmentStageUnitCount" in item.data,
  );

  const expandedUnits = getExpandedSpecialistUnits(
    specialistUnits,
    specialistData,
  );

  const expandedDevelopmentStage = getExpandedDevelopmentStages(
    partialDevelopmentStages,
    developmentData,
  );

  const themes = getThemes(specialistUnits);

  return {
    units: expandedUnits.sort((a, b) => {
      if (a && a[0] && b && b[0]) {
        return a[0].orderInProgramme - b[0].orderInProgramme;
      } else return 0;
    }),
    developmentStage: expandedDevelopmentStage,
    programmeSlug: specialistUnits[0]?.synthetic_programme_slug,
    subjectSlug: specialistUnits[0]?.combined_programme_fields.subject_slug,
    subjectTitle: specialistUnits[0]?.combined_programme_fields.subject,
    learningThemes: themes,
    developmentStageSlug:
      specialistUnits[0]?.combined_programme_fields.developmentstage_slug ||
      null,
  };
};

export const populateUnitsWithBatchResponses = async (
  specialistUnits: SpecialistUnitListRequestSchema,
  partialDevelopmentStages: Array<Partial<DevelopmentStage>>,
) => {
  const unitBatchRequests = getUnitBatchRequests(specialistUnits);
  const developmentStagesBatchRequest = getDevelopmentStagesBatchRequests(
    partialDevelopmentStages,
  );

  const combinedBatchRequests = [
    ...unitBatchRequests,
    ...developmentStagesBatchRequest,
  ];
  const data = await getBatchedRequests(combinedBatchRequests);

  return getUnitListingPageData(
    data,
    specialistUnits,
    partialDevelopmentStages,
  );
};

export const fetchSubjectDevelopmentStages = async (
  sdk: Sdk,
  specialistUnits: SpecialistUnitListRequestSchema,
) => {
  try {
    const subjectSlug =
      specialistUnits[0]?.combined_programme_fields.subject_slug;
    let developmentStages: Array<Partial<DevelopmentStage>> = [];
    if (subjectSlug) {
      const stagesRes = await sdk.developmentStages({
        _contains: { subject_slug: subjectSlug },
      });

      const parsedStagesRes = developmentStageCombinedProgrammeFields.parse(
        stagesRes.developmentStages,
      );
      developmentStages = getPartialDevelopmentStageArray(parsedStagesRes);
    }
    return developmentStages;
  } catch (error) {
    throw new OakError({
      code: "curriculum-api/not-found",
      originalError: error,
    });
  }
};

const specialistUnitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.specialistUnitListing(args);

    if (res.specialistUnits.length < 1) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const specialistUnits = specialistUnitListRequestSchema.parse(
      res.specialistUnits,
    );

    const partialDevelopmentStages = await fetchSubjectDevelopmentStages(
      sdk,
      specialistUnits,
    );

    const specialistUnitsPageData = await populateUnitsWithBatchResponses(
      specialistUnits,
      partialDevelopmentStages,
    );

    return specialistUnitListingSchema.parse(specialistUnitsPageData);
  };

export default specialistUnitListingQuery;
