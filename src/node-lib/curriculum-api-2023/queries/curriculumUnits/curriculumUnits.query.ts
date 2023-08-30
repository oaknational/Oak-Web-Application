import curriculumUnitsSchema from "./curriculumUnits.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const curriculumUnitsQuery = (sdk: Sdk) => async (args: { slug: string }) => {
  const parts = args.slug.split("-");
  const lastSlug = parts.pop();
  let phaseSlug, examboardSlug;
  // Update below if any new examboards are added
  if (lastSlug && ["aqa", "edexcel", "ocr"].includes(lastSlug)) {
    examboardSlug = lastSlug;
    phaseSlug = parts.pop();
  } else {
    examboardSlug = null;
    phaseSlug = lastSlug;
  }
  const subjectSlug = parts.join("-");
  if (!subjectSlug || !phaseSlug) {
    throw new OakError({
      code: "curriculum-api/params-incorrect",
    });
  }

  const baseWhere = {
    _and: [
      { subject_slug: { _eq: subjectSlug } },
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

  return curriculumUnitsSchema.parse(res);
};

export default curriculumUnitsQuery;
