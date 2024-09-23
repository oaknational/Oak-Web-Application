import CurriculumUnitsSchema from "./curriculumUnits.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const curriculumUnitsQuery =
  (sdk: Sdk) =>
  async (args: {
    subjectSlug: string;
    phaseSlug: string;
    ks4OptionSlug: string | null;
  }) => {
    const { subjectSlug, phaseSlug, ks4OptionSlug } = args;
    if (!subjectSlug || !phaseSlug) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
    }

    const baseWhere = {
      _and: [
        {
          _or: [
            { subject_slug: { _eq: subjectSlug } },
            { subject_parent_slug: { _eq: subjectSlug } },
          ],
        },
        { phase_slug: { _eq: phaseSlug } },
      ],
    };

    const ks4OptionCondition = ks4OptionSlug
      ? {
          _or: [
            { examboard_slug: { _eq: ks4OptionSlug } },
            { examboard_slug: { _is_null: true } },
          ],
        }
      : { examboard_slug: { _is_null: true } };

    const where = {
      ...baseWhere,
      _and: [...baseWhere._and, ks4OptionCondition],
    };

    const res = await sdk.curriculumUnits({
      where: where,
    });

    const units = res.units.map((unit) => {
      return {
        ...unit,
        order: unit.order ?? 0,
      };
    });

    if (!units || units.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return CurriculumUnitsSchema.parse({ units });
  };

export default curriculumUnitsQuery;
