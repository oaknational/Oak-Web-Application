import CurriculumSequenceSchema from "./curriculumSequence.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

const curriculumSequenceQuery =
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
        { state: { _eq: "published" } },
      ],
    };

    const isExamboard = isExamboardSlug(ks4OptionSlug);

    const examboardSlug = isExamboard ? ks4OptionSlug : null;
    const pathwaySlug = !isExamboard ? ks4OptionSlug : null;

    const examboardCondition = examboardSlug
      ? {
          _or: [
            { examboard_slug: { _eq: examboardSlug } },
            {
              _and: [{ examboard_slug: { _is_null: true } }],
            },
          ],
        }
      : { examboard_slug: { _is_null: true } };

    const pathwayCondition = pathwaySlug
      ? {
          _or: [
            { pathway_slug: { _eq: pathwaySlug } },
            { pathway_slug: { _eq: "core" } },
            { pathway_slug: { _is_null: true } },
          ],
        }
      : { pathway_slug: { _is_null: true } };

    const where = {
      ...baseWhere,
      _and: [
        ...baseWhere._and,
        isExamboard ? examboardCondition : pathwayCondition,
        { non_curriculum: { _eq: false } },
      ],
    };

    const res = await sdk.curriculumSequence({
      where: where,
    });

    const { units } = res;

    if (!units || units.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return CurriculumSequenceSchema.parse({ units });
  };

export default curriculumSequenceQuery;
