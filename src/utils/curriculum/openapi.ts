import { z } from "zod";

import { Unit } from "./types";
import { CurriculumSelectionSlugs } from "./slugs";

const categorySchema = z.object({
  categoryTitle: z.string(),
});

const threadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  order: z.number(),
});

const unitOptionSchema = z.object({
  unitTitle: z.string(),
  unitSlug: z.string(),
});

const unitSchema = z.object({
  unitTitle: z.string(),
  unitSlug: z.string().default("UNKNOWN"),
  unitOrder: z.number(),
  categories: z.array(categorySchema).default([]),
  threads: z.array(threadSchema).default([]),
  unitOptions: z.array(unitOptionSchema).default([]),
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
  examSubjectTitle: z.string(),
  examSubjectSlug: z.string(),
  tiers: z.array(tierSchema),
});
const subjectsSchema = z.object({
  year: z.number(),
  examSubjects: z.array(z.union([subjectSchema, subjectTiersSchema])),
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
  unitOrder: number;
  subjectSlug?: string;
  subjectTitle?: string;
  tier?: string;
  threads: {
    title: string;
    slug: string;
    order: number;
  }[];
  subjectCategories: {
    id: number;
    title: string;
  }[];
  unitOptions: {
    unitTitle: string;
    unitSlug: string;
  }[];
};

// TODO: We don't have a subject slug right now, so we map against the title (HACK)
const hackSubjectCategoryMappings = [
  {
    subjectcategory_id: 1,
    title: "Biology",
  },
  {
    subjectcategory_id: 2,
    title: "Chemistry",
  },
  {
    subjectcategory_id: 3,
    title: "Physics",
  },
  {
    subjectcategory_id: 4,
    title: "Reading, writing & oracy",
  },
  {
    subjectcategory_id: 5,
    title: "Grammar",
  },
  {
    subjectcategory_id: 6,
    title: "Handwriting",
  },
  {
    subjectcategory_id: 7,
    title: "Spelling",
  },
  {
    subjectcategory_id: 8,
    title: "Vocabulary",
  },
  {
    subjectcategory_id: 17,
    title: "Theology",
  },
  {
    subjectcategory_id: 15,
    title: "Philosophy",
  },
  {
    subjectcategory_id: 16,
    title: "Social science",
  },
  {
    subjectcategory_id: 18,
    title: "Language",
  },
  {
    subjectcategory_id: 19,
    title: "Literature",
  },
];

function getSubjectCategory(unit: z.infer<typeof unitSchema>) {
  const out: ApiUnit["subjectCategories"] = [];
  unit.categories.forEach((unmappedCaterory) => {
    const found = hackSubjectCategoryMappings.find(
      (h) => h.title === unmappedCaterory.categoryTitle,
    );
    if (found) {
      out.push({
        id: found.subjectcategory_id,
        title: found.title,
      });
    }
  });
  return out;
}

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
            unitOrder: unitObj.unitOrder,
            threads: unitObj.threads,
            tier: tierObj.tier,
            subjectCategories: getSubjectCategory(unitObj),
            unitOptions: unitObj.unitOptions,
          };
        });
      });
    } else if ("examSubjects" in yearObj) {
      return yearObj.examSubjects.flatMap((subjectObj) => {
        if ("tiers" in subjectObj) {
          return subjectObj.tiers.flatMap((tierObj) => {
            return tierObj.units.map((unitObj) => {
              return {
                year: String(yearObj.year),
                unitTitle: unitObj.unitTitle,
                unitSlug: unitObj.unitSlug,
                unitOrder: unitObj.unitOrder,
                threads: unitObj.threads,
                subjectSlug: subjectObj.examSubjectSlug,
                subjectTitle: subjectObj.examSubjectTitle,
                tier: tierObj.tier,
                subjectCategories: getSubjectCategory(unitObj),
                unitOptions: unitObj.unitOptions,
              };
            });
          });
        } else {
          return subjectObj.units.map((unitObj) => {
            return {
              year: String(yearObj.year),
              unitTitle: unitObj.unitTitle,
              unitSlug: unitObj.unitSlug,
              unitOrder: unitObj.unitOrder,
              threads: unitObj.threads,
              subjectSlug: subjectObj.subjectSlug,
              subjectTitle: subjectObj.subjectTitle,
              subjectCategories: getSubjectCategory(unitObj),
              unitOptions: unitObj.unitOptions,
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
          unitOrder: unitObj.unitOrder,
          threads: unitObj.threads,
          subjectCategories: getSubjectCategory(unitObj),
          unitOptions: unitObj.unitOptions,
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
      order: apiUnit.unitOrder,
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
      subjectcategories: apiUnit.subjectCategories,
      threads: apiUnit.threads,
      title: apiUnit.unitTitle,
      description: "",
      why_this_why_now: "",
      cycle: "2",
      features: null,
      unit_options: apiUnit.unitOptions.map((option) => {
        return {
          connection_prior_unit_description: null,
          connection_future_unit_description: null,
          connection_prior_unit_title: null,
          connection_future_unit_title: null,
          description: null,
          why_this_why_now: null,
          title: option.unitTitle,
          unitvariant_id: -1,
          slug: option.unitSlug,
          lessons: [],
          state: "published",
        };
      }),
      year: apiUnit.year,
      state: "published",
    };
  });

  return {
    units,
  };
}
