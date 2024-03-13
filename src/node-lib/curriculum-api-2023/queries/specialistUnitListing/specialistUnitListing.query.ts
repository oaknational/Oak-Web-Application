import { Sdk, getBatchedRequests } from "../../sdk";
import {
  SpecialistLessonCountDocument,
  DevelopmentStageUnitCountDocument,
} from "../../generated/sdk";

import {
  BatchResultResponseArray,
  DevelopmentalStage,
  SpecialistUnitListRequestSchema,
  SpecialistUnitListingData,
  batchResultResponseArray,
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
    if (data[i]?.data) {
      return [
        {
          title: unit.unit_title,
          slug: unit.unit_slug,
          lessonCount: batchRes.specialistUnitLessonCount.aggregate.count,
          nullTitle: unit.unit_title,
          programmeSlug: unit.synthetic_programme_slug,
          subjectSlug: unit.combined_programme_fields.subject_slug,
          subjectTitle: unit.combined_programme_fields.subject,
          expired: unit.expired || false,
          expiredLessonCount:
            batchRes.specialistUnitExpiredLessonCount.aggregate.count,
          themeSlug: unit.combined_programme_fields.phase_slug || null,
          themeTitle: unit.combined_programme_fields.phase || null,
          learningThemes: [
            {
              themeSlug: unit.combined_programme_fields.phase_slug || null,
              themeTitle: unit.combined_programme_fields.phase || null,
            },
          ],
          developmentalStageSlug:
            unit.combined_programme_fields.developmentstage_slug || null,
          developmentalStageTitle:
            unit.combined_programme_fields.developmentstage || null,
        },
      ];
    }
  });

  return units;
};

export const getExpandedDevelopmentalStages = (
  partialDevelopmentStages: Array<Partial<DevelopmentalStage>>,
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
  developmentalStages: Partial<DevelopmentalStage>[],
) => {
  return developmentalStages.map((c) => {
    return {
      document: DevelopmentStageUnitCountDocument,
      variables: {
        _contains: {
          developmentstage_slug: c?.slug,
        },
        syntheticProgrammeSlug: c?.programmeSlug,
      },
    };
  });
};

export const getPartialDevelopmentStages = (
  specialistUnits: SpecialistUnitListRequestSchema,
) => {
  return specialistUnits.reduce(
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
    [] as Array<Partial<DevelopmentalStage>>,
  );
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

export const populateUnitsWithBatchResponses = async (
  specialistUnits: SpecialistUnitListRequestSchema,
) => {
  const unitBatchRequests = getUnitBatchRequests(specialistUnits);
  const partialDevelopmentStages = getPartialDevelopmentStages(specialistUnits);
  const developmentStagesBatchRequest = getDevelopmentStagesBatchRequests(
    partialDevelopmentStages,
  );

  const combinedBatchRequests = [
    ...unitBatchRequests,
    ...developmentStagesBatchRequest,
  ];
  const data = await getBatchedRequests(combinedBatchRequests);

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
  const expandedDevelopmentStage = getExpandedDevelopmentalStages(
    partialDevelopmentStages,
    developmentData,
  );

  const themes = getThemes(specialistUnits);

  return {
    units: expandedUnits,
    developmentalStage: expandedDevelopmentStage,
    programmeSlug: specialistUnits[0]?.synthetic_programme_slug,
    subjectSlug: specialistUnits[0]?.combined_programme_fields.subject_slug,
    subjectTitle: specialistUnits[0]?.combined_programme_fields.subject,
    learningThemes: themes,
    developmentalStageSlug:
      specialistUnits[0]?.combined_programme_fields.developmentstage_slug ||
      null,
  };
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

    const specialistUnitsPageData =
      await populateUnitsWithBatchResponses(specialistUnits);
    console.log(specialistUnitsPageData);
    return specialistUnitListingSchema.parse(specialistUnitsPageData);
  };

export default specialistUnitListingQuery;
