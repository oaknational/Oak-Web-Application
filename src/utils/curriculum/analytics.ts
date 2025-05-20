import { CurriculumFilters } from "./types";

import {
  Platform,
  Product,
  EngagementIntent,
  ComponentType,
  EventVersion,
  Phase,
  LearningTier,
  UnitSequenceRefinedProperties,
  AnalyticsUseCaseValueType,
  PathwayValueType,
} from "@/browser-lib/avo/Avo";
import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";

function assertValidPathway(
  pathway: string | undefined,
): PathwayValueType | null {
  if (pathway === "core") {
    return "Core";
  }
  if (pathway === "non_core") {
    return "GCSE";
  }
  return null;
}

/**
 * Builds analytics data for the unitSequenceRefined event
 *
 * @param curriculumSelectionSlugs - The slugs for the current curriculum selection
 * @param curriculumUnitsTrackingData - The tracking data for the current curriculum units
 * @param filters - The current filters being applied
 * @returns The properties for the unitSequenceRefined event
 */
export function buildUnitSequenceRefinedAnalytics(
  analyticsUseCase: AnalyticsUseCaseValueType,
  curriculumUnitsTrackingData: CurriculumUnitsTrackingData,
  filters: CurriculumFilters,
): UnitSequenceRefinedProperties {
  const { phaseSlug } = curriculumUnitsTrackingData;

  return {
    yearGroupName: filters.years.length > 0 ? filters.years[0] : null,
    yearGroupSlug: filters.years.length > 0 ? filters.years[0] : null,
    subjectTitle: curriculumUnitsTrackingData.subjectTitle,
    subjectSlug: curriculumUnitsTrackingData.subjectSlug,
    threadTitle: filters.threads.length > 0 ? filters.threads[0] : null,
    threadSlug: filters.threads.length > 0 ? filters.threads[0] : null,
    platform: Platform.OWA,
    product: Product.CURRICULUM_VISUALISER,
    engagementIntent: EngagementIntent.REFINE,
    componentType: ComponentType.FILTER_LINK,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: analyticsUseCase,
    childSubjectSlug:
      filters.childSubjects.length > 0 ? filters.childSubjects[0] : null,
    childSubjectName:
      filters.childSubjects.length > 0 ? filters.childSubjects[0] : null,
    phase: phaseSlug === "primary" ? Phase.PRIMARY : Phase.SECONDARY,
    learningTier:
      filters.tiers.length > 0 && filters.tiers[0]
        ? filters.tiers[0].toLowerCase() === "foundation"
          ? LearningTier.FOUNDATION
          : filters.tiers[0].toLowerCase() === "higher"
            ? LearningTier.HIGHER
            : null
        : null,
    subjectCategory:
      filters.subjectCategories.length > 0
        ? filters.subjectCategories[0]
        : null,
    pathway: assertValidPathway(filters.pathways[0]),
  };
}
