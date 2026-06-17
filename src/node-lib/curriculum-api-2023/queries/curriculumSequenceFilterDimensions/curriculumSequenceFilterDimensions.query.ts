import curriculumSequenceFilterDimensionsSchema, {
  buildExamboardFilterDimensions,
  type ExamboardFilterDimension,
} from "./curriculumSequenceFilterDimensions.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

export type { ExamboardFilterDimension };

const curriculumSequenceFilterDimensionsQuery =
  (sdk: Sdk) =>
  async (args: {
    subjectSlug: string;
    phaseSlug: string;
    examBoardSlugs: string[];
    includeNonCurriculum?: boolean;
  }): Promise<Record<string, ExamboardFilterDimension>> => {
    const { subjectSlug, phaseSlug, examBoardSlugs, includeNonCurriculum } =
      args;

    if (!subjectSlug || !phaseSlug) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
    }

    if (examBoardSlugs.length === 0) {
      return {};
    }

    const where = {
      _and: [
        {
          _or: [
            { subject_slug: { _eq: subjectSlug } },
            { subject_parent_slug: { _eq: subjectSlug } },
          ],
        },
        { phase_slug: { _eq: phaseSlug } },
        { state: { _eq: "published" } },
        ...(includeNonCurriculum
          ? []
          : [{ non_curriculum: { _eq: false } as const }]),
      ],
    };

    const res = await sdk.curriculumSequenceFilterDimensions({
      where,
    });

    const { units } = curriculumSequenceFilterDimensionsSchema.parse(res);

    if (!units || units.length === 0) {
      return Object.fromEntries(
        examBoardSlugs.map((examboardSlug) => [
          examboardSlug,
          { tierSlugs: [], pathwaySlugs: [], childSubjectSlugs: [] },
        ]),
      );
    }

    return buildExamboardFilterDimensions(units, examBoardSlugs);
  };

export default curriculumSequenceFilterDimensionsQuery;
