import {
  pathwaySlugs,
  subjectSlugs,
  tierSlugs,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";

export const filterValueSchemas = z.object({
  childSubjects: subjectSlugs.array(),
  subjectCategories: z.string().array(),
  tiers: tierSlugs.array(),
  years: z.string().array(),
  threads: z.string().array(),
  pathways: pathwaySlugs.array(),
  keystages: z.string().array(),
});

export type BrowseFilters = z.infer<typeof filterValueSchemas>;
export type BrowseFiltersKey = keyof BrowseFilters;

export const browseFilterQueryParamMap: Record<BrowseFiltersKey, string> = {
  childSubjects: "child_subjects",
  subjectCategories: "subject_categories",
  tiers: "tiers",
  years: "years",
  threads: "threads",
  pathways: "pathways",
  keystages: "keystages",
};

export const browseFilterKeys = Object.keys(
  browseFilterQueryParamMap,
) as BrowseFiltersKey[];
