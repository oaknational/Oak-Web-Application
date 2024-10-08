import CurriculumUnitsIncludeNewSchema from "./curriculumUnitsIncludeNew.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const curriculumUnitsIncludeNewQuery =
  (sdk: Sdk) =>
  async (args: {
    subjectSlug: string;
    phaseSlug: string;
    examboardSlug: string | null;
    state?: string;
  }) => {
    const { subjectSlug, phaseSlug, examboardSlug, state = "published" } = args;
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
        { state: { _eq: state } },
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

    const res = await sdk.curriculumUnitsIncludeNew({
      where: where,
    });

    const units = res.units;

    if (!units || units.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return CurriculumUnitsIncludeNewSchema.parse(res);
  };

export default curriculumUnitsIncludeNewQuery;
