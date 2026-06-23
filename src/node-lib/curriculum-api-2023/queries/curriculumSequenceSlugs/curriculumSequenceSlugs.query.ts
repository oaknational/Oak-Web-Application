import curriculumSequenceSlugsSchema, {
  type CurriculumSequenceSlugUnit,
} from "./curriculumSequenceSlugs.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

export type { CurriculumSequenceSlugUnit };

const curriculumSequenceSlugsQuery =
  (sdk: Sdk) =>
  async (args: {
    subjectSlug: string;
    phaseSlug: string;
    includeNonCurriculum?: boolean;
  }): Promise<CurriculumSequenceSlugUnit[]> => {
    const { subjectSlug, phaseSlug, includeNonCurriculum } = args;

    if (!subjectSlug || !phaseSlug) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
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

    const res = await sdk.curriculumSequenceSlugs({
      where,
    });

    const { units } = curriculumSequenceSlugsSchema.parse(res);

    return units ?? [];
  };

export default curriculumSequenceSlugsQuery;
