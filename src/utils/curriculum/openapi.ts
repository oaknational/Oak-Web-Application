import { z } from "zod";

import { Unit } from "./types";
import { CurriculumSelectionSlugs } from "./slugs";

const unitSchema = z.object({
  unitTitle: z.string(),
  unitSlug: z.string(),
  order: z.number(),
  prior_knowledge_requirements: z.array(z.string()).default([]),
});
const nonSubjectSchema = z.object({
  year: z.number(),
  units: z.array(unitSchema),
});
const subjectSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  units: z.array(unitSchema),
});
const tierSchema = z.object({
  tier: z.string(),
  units: z.array(unitSchema),
});
const subjectTiersSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tiers: z.array(tierSchema),
});
const subjectsSchema = z.object({
  year: z.number(),
  subjects: z.array(z.union([subjectSchema, subjectTiersSchema])),
});
const tiersSchema = z.object({
  year: z.number(),
  tiers: z.array(tierSchema),
});
const openApiSchema = z.array(
  z.union([nonSubjectSchema, subjectsSchema, tiersSchema]),
);

type ApiUnit = {
  year: string;
  unitTitle: string;
  unitSlug: string;
  order: number;
  subjectSlug?: string;
  subjectTitle?: string;
  tier?: string;
  prior_knowledge_requirements: string[] | null;
};

export default async function openApiRequest(
  subjectPhaseSlug: string,
  slugs: CurriculumSelectionSlugs,
) {
  const res = await fetch(
    `${process.env.OPENAPI_URL}/api/v0/sequences/${subjectPhaseSlug}/units`,
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAPI_KEY}`,
      },
    },
  );

  const raw = await res.json();
  const body = openApiSchema.parse(raw);

  // Note: This should be waaay smarter, just for testing
  const apiUnits = body.flatMap<ApiUnit>((yearObj) => {
    if ("tiers" in yearObj) {
      return yearObj.tiers.flatMap((tierObj) => {
        return tierObj.units.map((unitObj) => {
          return {
            year: String(yearObj.year),
            unitTitle: unitObj.unitTitle,
            unitSlug: unitObj.unitSlug,
            order: unitObj.order,
            tier: tierObj.tier,
            prior_knowledge_requirements: unitObj.prior_knowledge_requirements,
          };
        });
      });
    } else if ("subjects" in yearObj) {
      return yearObj.subjects.flatMap((subjectObj) => {
        if ("tiers" in subjectObj) {
          return subjectObj.tiers.flatMap((tierObj) => {
            return tierObj.units.map((unitObj) => {
              return {
                year: String(yearObj.year),
                unitTitle: unitObj.unitTitle,
                unitSlug: unitObj.unitSlug,
                order: unitObj.order,
                subjectSlug: subjectObj.subjectSlug,
                subjectTitle: subjectObj.subjectTitle,
                tier: tierObj.tier,
                prior_knowledge_requirements:
                  unitObj.prior_knowledge_requirements,
              };
            });
          });
        } else {
          return subjectObj.units.map((unitObj) => {
            return {
              year: String(yearObj.year),
              unitTitle: unitObj.unitTitle,
              unitSlug: unitObj.unitSlug,
              order: unitObj.order,
              subjectSlug: subjectObj.subjectSlug,
              subjectTitle: subjectObj.subjectTitle,
              prior_knowledge_requirements:
                unitObj.prior_knowledge_requirements,
            };
          });
        }
      });
    } else if ("units" in yearObj) {
      return yearObj.units.map((unitObj) => {
        return {
          year: String(yearObj.year),
          unitTitle: unitObj.unitTitle,
          unitSlug: unitObj.unitSlug,
          order: unitObj.order,
          prior_knowledge_requirements: unitObj.prior_knowledge_requirements,
        };
      });
    } else {
      throw new Error("Invalid data");
    }
  });

  const units = apiUnits.map<Unit>((apiUnit) => {
    const subjectSlug = apiUnit.subjectSlug
      ? apiUnit.subjectSlug
      : slugs.subjectSlug;
    const subjectTitle = apiUnit.subjectTitle
      ? apiUnit.subjectTitle
      : slugs.subjectSlug;
    const subjectParent = apiUnit.subjectSlug ? slugs.subjectSlug : null;

    return {
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      planned_number_of_lessons: 0,
      phase: slugs.phaseSlug,
      phase_slug: slugs.phaseSlug,
      keystage_slug: "",
      lessons: [],
      order: apiUnit.order,
      slug: apiUnit.unitSlug,
      subject: subjectTitle,
      subject_slug: subjectSlug,
      subject_parent: subjectParent,
      subject_parent_slug: subjectParent,
      tier: apiUnit.tier ?? null,
      tier_slug: apiUnit.tier ?? null,
      pathway: null,
      pathway_slug: null,
      tags: [],
      subjectcategories: [],
      threads: [],
      title: apiUnit.unitTitle,
      description: "",
      why_this_why_now: "",
      cycle: "2",
      features: null,
      unit_options: [],
      year: apiUnit.year,
      state: "published",
      national_curriculum_content: [],
      prior_knowledge_requirements: apiUnit.prior_knowledge_requirements ?? [],
    };
  });

  return {
    units,
  };
}
