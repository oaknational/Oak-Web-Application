import CurriculumUnitsSchema from "./curriculumUnits.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const curriculumUnitsQuery =
  (sdk: Sdk) =>
  async (args: {
    subjectSlug: string;
    phaseSlug: string;
    examboardSlug: string | null;
  }) => {
    const { subjectSlug, phaseSlug, examboardSlug } = args;
    if (!subjectSlug || !phaseSlug) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
    }

    const baseWhere = {
      _and: [
        {
          // TODO: Make this configurable
          state: { _in: ["published", "new"] },
        },
        {
          _or: [
            { subject_slug: { _eq: subjectSlug } },
            { subject_parent_slug: { _eq: subjectSlug } },
          ],
        },
        { phase_slug: { _eq: phaseSlug } },
      ],
    };

    const examboardCondition = examboardSlug
      ? {
          _or: [
            { examboard_slug: { _eq: examboardSlug } },
            { examboard_slug: { _is_null: true } },
          ],
        }
      : { examboard_slug: { _is_null: true } };

    const where = {
      ...baseWhere,
      _and: [...baseWhere._and, examboardCondition],
    };

    const res = await sdk.curriculumUnits({
      where: where,
    });

    const units = res.units;

    if (!units || units.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return CurriculumUnitsSchema.parse(res);
  };

export default curriculumUnitsQuery;
