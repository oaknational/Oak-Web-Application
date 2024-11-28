import { reshapeUnitData } from "./helpers/reshapeUnitData";
import { getAllLearningThemes } from "./helpers/getAllLearningThemes";
import {
  applySlugsToUnitCategories,
  getAllCategories,
} from "./helpers/getAllCategories";
import { getAllYearGroups } from "./helpers/getAllYearGroups";
import {
  GroupedUnitsSchema,
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

    // this is a temporary fix for legacy data to remove duplicates units within key stage
    // we will remove once legacy data is removed
    const reduceBySlugAndYearOrder = (arr: GroupedUnitsSchema) => {
      return Object.values(
        arr.reduce(
          (acc, item) => {
            const { slug, yearOrder } = item[0] ?? {};
            if (!slug || !yearOrder) {
              return acc;
            } else if (!acc[slug]) {
              acc[slug] = item;
              return acc;
            } else {
              if (acc[slug][0]) {
                if (acc[slug][0].yearOrder > yearOrder) {
                  acc[slug] = item;
                }
              }
              return acc;
            }
          },
          {} as { [key: string]: GroupedUnitsSchema[number] },
        ),
      );
    };

    const reducedUnitsArray = reduceBySlugAndYearOrder(
      unitsWithSubjectCategories,
    );

    const tiers = programmeFields.tierSlug
      ? getTierData(args.programmeSlug)
      : [];

    const hasNewContent = reshapedUnits
      .flatMap((unit) => unit.flatMap((u) => u.cohort ?? "2020-2023"))
      .includes(NEW_COHORT);

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
      units: reducedUnitsArray,
      phase: programmeFields.phaseSlug,
      learningThemes: learningThemes,
      hasNewContent,
      subjectCategories,
      yearGroups,
    };
  };

export default unitListingQuery;
