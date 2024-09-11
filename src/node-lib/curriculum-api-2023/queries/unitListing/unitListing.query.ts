import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";
import { kebabCase } from "lodash";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { getTiersForProgramme } from "./tiers/getTiersForProgramme";
import { getUnitsForProgramme } from "./units/getUnitsForProgramme";
import { getAllLearningThemes } from "./threads/getAllLearningThemes";

import { NEW_COHORT } from "@/config/cohort";

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);
    const unitsForProgramme = res.units;

    if (!unitsForProgramme || unitsForProgramme.length === 0) {
      return null;
    }

    const parsedRawUnits = unitsForProgramme.map((p) =>
      syntheticUnitvariantLessonsSchema.parse(p),
    );

    const firstUnit = parsedRawUnits[0];

    if (!firstUnit) {
      throw new OakError({
        code: "curriculum-api/not-found",
      });
    }

    const programmeFields = firstUnit.programme_fields;

    const isLegacy = firstUnit.is_legacy;
    const hasTiers = parsedRawUnits.some(
      (p) => p.programme_fields.tier_slug !== null,
    );
    const tiers = hasTiers
      ? await getTiersForProgramme(
          sdk,
          programmeFields.subject_slug,
          programmeFields.keystage_slug,
          programmeFields.examboard_slug,
          isLegacy,
        )
      : [];

    const units = await getUnitsForProgramme(parsedRawUnits);

    const learningThemes = getAllLearningThemes(units);

    // REFACTOR: This is a temporary solution to get the subject categories
    const subjectCats = Array.from(
      new Set(
        parsedRawUnits
          .flatMap((u) => u.unit_data.subjectcategories)
          .filter(
            (category): category is string => typeof category === "string",
          ),
      ),
    ).sort();

    const subjectCategories = subjectCats.map((category) => {
      const categoryIconMap: { [key: string]: string } = {
        Grammar: "subject-english-grammar",
        Handwriting: "subject-english-handwriting",
        "Reading, writing & oracy": "subject-english-reading-writing-oracy",
        Spelling: "subject-english-spelling",
        Vocabulary: "subject-english-vocabulary",
        Physics: "subject-physics",
        Biology: "subject-biology",
        Chemistry: "subject-chemistry",
      };

      return {
        label: category,
        iconName: categoryIconMap[category] ?? "",
        slug: kebabCase(category),
      };
    });

    const hasNewContent = units
      .flatMap((unit) => unit.flatMap((u) => u.cohort ?? "2020-2023"))
      .includes(NEW_COHORT);

    return {
      programmeSlug: args.programmeSlug,
      keyStageSlug: programmeFields.keystage_slug,
      keyStageTitle: programmeFields.keystage_description,
      examBoardSlug: programmeFields.examboard_slug,
      examBoardTitle: programmeFields.examboard,
      subjectSlug: programmeFields.subject_slug,
      subjectTitle: programmeFields.subject,
      subjectParent: programmeFields.subject_parent || null,
      tierSlug: programmeFields.tier_slug,
      tiers: tiers,
      units: units,
      phase: programmeFields.phase_slug,
      learningThemes: learningThemes,
      hasNewContent,
      subjectCategories,
    };
  };

export default unitListingQuery;
