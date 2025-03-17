import { CurriculumFilters } from "./types";
import { CurriculumSelectionSlugs } from "./slugs";

import {
  Platform,
  Product,
  EngagementIntent,
  ComponentType,
  EventVersion,
  AnalyticsUseCase,
  Phase,
  LearningTier,
  UnitSequenceRefinedProperties,
} from "@/browser-lib/avo/Avo";
import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";

/**
 * Builds analytics data for the unitSequenceRefined event
 *
 * @param curriculumSelectionSlugs - The slugs for the current curriculum selection
 * @param curriculumUnitsTrackingData - The tracking data for the current curriculum units
 * @param filters - The current filters being applied
 * @returns The properties for the unitSequenceRefined event
 */
export function buildUnitSequenceRefinedAnalytics(
  curriculumSelectionSlugs: CurriculumSelectionSlugs,
  curriculumUnitsTrackingData: CurriculumUnitsTrackingData,
  filters: CurriculumFilters,
): UnitSequenceRefinedProperties {
  const { phaseSlug } = curriculumSelectionSlugs;

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
    analyticsUseCase: AnalyticsUseCase.TEACHER,
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
  };
}
