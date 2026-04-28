import { Published_Mv_Curriculum_Sequence_B_13_0_21_Bool_Exp } from "../../generated/sdk";

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
    includeNonCurriculum?: boolean;
    /**
     * If true, will exclude units that have no published lessons
     */
    excludeUnitsWithNoPublishedLessons?: boolean;
    /**
     * If true, units with pathway_slug "core" are excluded.
     */
    excludeCoreUnits?: boolean;
  }) => {
    const {
      subjectSlug,
      phaseSlug,
      ks4OptionSlug,
      excludeUnitsWithNoPublishedLessons,
      excludeCoreUnits = false,
    } = args;
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
    const excludeCorePathwayCondition = {
      _or: [
        { pathway_slug: { _neq: "core" } },
        { pathway_slug: { _is_null: true } },
      ],
    };
    const includeCorePathwayCondition = { pathway_slug: { _eq: "core" } };

    let examboardCondition: Published_Mv_Curriculum_Sequence_B_13_0_21_Bool_Exp =
      {
        examboard_slug: { _is_null: true },
      };
    if (examboardSlug) {
      const examboardConditions: Published_Mv_Curriculum_Sequence_B_13_0_21_Bool_Exp[] =
        [
          {
            _or: [
              { examboard_slug: { _eq: examboardSlug } },
              { _and: [{ examboard_slug: { _is_null: true } }] },
            ],
          },
        ];
      if (excludeCoreUnits) {
        examboardConditions.push(excludeCorePathwayCondition);
      }
      examboardCondition = { _and: examboardConditions };
    }

    let pathwayCondition: Published_Mv_Curriculum_Sequence_B_13_0_21_Bool_Exp =
      {
        pathway_slug: { _is_null: true },
      };
    if (pathwaySlug) {
      const pathwayConditions: Published_Mv_Curriculum_Sequence_B_13_0_21_Bool_Exp[] =
        [
          { pathway_slug: { _eq: pathwaySlug } },
          { pathway_slug: { _is_null: true } },
        ];
      if (!excludeCoreUnits) {
        pathwayConditions.push(includeCorePathwayCondition);
      }
      pathwayCondition = { _or: pathwayConditions };
    }

    const where: Published_Mv_Curriculum_Sequence_B_13_0_21_Bool_Exp = {
      ...baseWhere,
      _and: [
        ...baseWhere._and,
        isExamboard ? examboardCondition : pathwayCondition,
      ],
    };

    if (!args.includeNonCurriculum) {
      where._and!.push({ non_curriculum: { _eq: false } });
    }

    if (excludeUnitsWithNoPublishedLessons) {
      where._and!.push({ lessons: { _contains: [{ _state: "published" }] } });
    }

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
