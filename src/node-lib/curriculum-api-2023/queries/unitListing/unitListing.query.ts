import { SubjectSlugs } from "../pupilSubjectListing/pupilSubjectListing.schema";

import { reshapeUnitData } from "./helpers/reshapeUnitData";
import { getAllLearningThemes } from "./helpers/getAllLearningThemes";
import {
  applySlugsToUnitCategories,
  getAllCategories,
} from "./helpers/getAllCategories";
import { getAllYearGroups } from "./helpers/getAllYearGroups";
import {
  ProgrammeFieldsCamel,
  rawQuerySchema,
  UnitListingData,
} from "./unitListing.schema";

import { NEW_COHORT } from "@/config/cohort";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import {
  UnitListingQuery,
  Sdk,
} from "@/node-lib/curriculum-api-2023/generated/sdk";
import OakError from "@/errors/OakError";

const getTierData = (programmeSlug: string): UnitListingData["tiers"] => [
  {
    tierSlug: "foundation",
    tierTitle: "Foundation",
    tierOrder: 1,
    tierProgrammeSlug: programmeSlug.replace("-higher", "-foundation"),
  },
  {
    tierSlug: "higher",
    tierTitle: "Higher",
    tierOrder: 2,
    tierProgrammeSlug: programmeSlug.replace("-foundation", "-higher"),
  },
];

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      UnitListingQuery["units"][number]
    >({
      journey: "teacher",
      queryName: "unitListingQuery",
      browseData: res.units,
    });

    if (modifiedBrowseData.length === 0) {
      return null;
    }

    let parsedUnits;
    try {
      parsedUnits = rawQuerySchema.parse(modifiedBrowseData);
    } catch (e) {
      throw new OakError({
        code: "curriculum-api/internal-error",
        meta: { error: e },
      });
    }

    const unitsCamel = keysToCamelCase(parsedUnits);
    const hasCycle2Content = unitsCamel.some(
      (u) => u.unitData.Cohort === "2024-2025",
    );

    const programmeFields = unitsCamel.reduce(
      (acc, val) => ({ ...acc, ...val.programmeFields }),
      {} as ProgrammeFieldsCamel,
    );

    const reshapedUnits = reshapeUnitData(unitsCamel);

    const yearGroups = getAllYearGroups(reshapedUnits);
    const learningThemes = getAllLearningThemes(reshapedUnits);
    const subjectCategories = getAllCategories(reshapedUnits);
    const unitsWithSubjectCategories = applySlugsToUnitCategories(
      subjectCategories,
      reshapedUnits,
    );

    const tiers = programmeFields.tierSlug
      ? getTierData(args.programmeSlug)
      : [];

    const hasNewContent = reshapedUnits
      .flatMap((unit) => unit.flatMap((u) => u.cohort ?? "2020-2023"))
      .includes(NEW_COHORT);

    const relatedSubjectsSet = new Set<SubjectSlugs>();
    parsedUnits.forEach((unit) => {
      if (unit.actions && unit.actions.related_subject_slugs) {
        unit.actions.related_subject_slugs.forEach((subject) => {
          relatedSubjectsSet.add(subject);
        });
      }
    });

    return {
      programmeSlug: args.programmeSlug,
      keyStageSlug: programmeFields.keystageSlug,
      keyStageTitle: programmeFields.keystageDescription,
      examBoardSlug: programmeFields.examboardSlug,
      examBoardTitle: programmeFields.examboard,
      subjectSlug: programmeFields.subjectSlug,
      subjectTitle: programmeFields.subject,
      subjectParent: programmeFields.subjectParent || null,
      tierSlug: programmeFields.tierSlug,
      tiers: tiers,
      units: unitsWithSubjectCategories,
      phase: programmeFields.phaseSlug,
      learningThemes: learningThemes,
      hasNewContent,
      subjectCategories,
      yearGroups,
      pathwayTitle: programmeFields.pathway,
      ...(relatedSubjectsSet.size >= 1 && {
        relatedSubjects: Array.from(relatedSubjectsSet),
      }),
      hasCycle2Content,
    };
  };

export default unitListingQuery;

export type UnitListingQueryReturn = ReturnType<typeof unitListingQuery>;
