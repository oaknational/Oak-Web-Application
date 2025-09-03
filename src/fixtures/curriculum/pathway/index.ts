import { getTitleFromSlug } from "@/fixtures/shared/helper";
import { Pathway } from "@/utils/curriculum/types";

const BASE_PATHWAY: Pathway = {
  pathway_slug: "blank",
  pathway: "Blank",
};

export function createPathway(partial: Partial<Pathway> = {}) {
  const pathway = getTitleFromSlug(partial?.pathway_slug);
  return {
    ...BASE_PATHWAY,
    ...(pathway ? { pathway } : {}),
    ...partial,
  };
}
