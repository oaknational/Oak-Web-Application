import { CurriculumFilters, Thread, Unit } from "./types";
import { areLessonsAvailable } from "./lessons";

import {
  Platform,
  Product,
  EngagementIntent,
  ComponentType,
  EventVersion,
  Phase,
  LearningTier,
  LearningTierValueType,
  UnitSequenceRefinedProperties,
  AnalyticsUseCaseValueType,
  PathwayValueType,
  UnitOverviewAccessedProperties,
  ComponentTypeValueType,
  AccessLevelValueType,
  NavigationTypeValueType,
  ExamBoardValueType,
} from "@/browser-lib/avo/Avo";
import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";

function assertValidLearningTier(
  tier: string | undefined,
): LearningTierValueType | null {
  switch (tier?.toLowerCase()) {
    case "foundation":
      return LearningTier.FOUNDATION;
    case "higher":
      return LearningTier.HIGHER;
    default:
      return null;
  }
}

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
  componentType?: ComponentTypeValueType,
): Omit<UnitSequenceRefinedProperties, "journeyId"> {
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
    componentType: componentType ?? ComponentType.FILTER_LINK,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: analyticsUseCase,
    childSubjectSlug:
      filters.childSubjects.length > 0 ? filters.childSubjects[0] : null,
    childSubjectName:
      filters.childSubjects.length > 0 ? filters.childSubjects[0] : null,
    phase: phaseSlug === "primary" ? Phase.PRIMARY : Phase.SECONDARY,
    learningTier: assertValidLearningTier(filters.tiers[0]),
    subjectCategory:
      filters.subjectCategories.length > 0
        ? filters.subjectCategories[0]
        : null,
    pathway: assertValidPathway(filters.pathways[0]),
    examBoard:
      (curriculumUnitsTrackingData.ks4OptionTitle as ExamBoardValueType) ??
      null,
  };
}

export function buildUnitOverviewAccessedAnalytics({
  unit,
  isHighlighted,
  analyticsUseCase,
  selectedThread,
  componentType,
  journeyId,
  accessLevel,
  navigationType,
}: {
  unit: Unit;
  isHighlighted: boolean;
  analyticsUseCase: AnalyticsUseCaseValueType;
  selectedThread?: Thread;
  componentType: UnitOverviewAccessedProperties["componentType"];
  journeyId: string;
  accessLevel: AccessLevelValueType;
  navigationType: NavigationTypeValueType;
}): UnitOverviewAccessedProperties {
  return {
    unitName: unit.title,
    unitSlug: unit.slug,
    subjectTitle: unit.subject,
    subjectSlug: unit.subject_slug,
    yearGroupName: `Year ${unit.year}`,
    yearGroupSlug: unit.year,
    threadTitle: selectedThread?.title ?? null,
    threadSlug: selectedThread?.slug ?? null,
    platform: "owa",
    product: "curriculum visualiser",
    engagementIntent: "use",
    componentType,
    eventVersion: "2.0.0",
    analyticsUseCase,
    unitHighlighted: isHighlighted,
    isUnitPublished: areLessonsAvailable(unit.lessons),
    journeyId,
    accessLevel,
    navigationType,
  };
}
