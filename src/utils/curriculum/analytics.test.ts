import { buildUnitSequenceRefinedAnalytics } from "./analytics";
import { CurriculumFilters } from "./types";

import {
  Platform,
  Product,
  EngagementIntent,
  ComponentType,
  EventVersion,
  AnalyticsUseCase,
  Phase,
  LearningTier,
} from "@/browser-lib/avo/Avo";
import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";

describe("buildUnitSequenceRefinedAnalytics", () => {
  const mockTrackingData: CurriculumUnitsTrackingData = {
    subjectSlug: "science",
    phaseSlug: "secondary",
    subjectTitle: "Science",
    ks4OptionSlug: null,
    ks4OptionTitle: null,
  };

  const baseFilters: CurriculumFilters = {
    childSubjects: [],
    subjectCategories: [],
    tiers: [],
    years: [],
    threads: [],
  };

  it("should build analytics with default values when no filters are applied", () => {
    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      baseFilters,
    );

    expect(result).toEqual({
      yearGroupName: null,
      yearGroupSlug: null,
      subjectTitle: "Science",
      subjectSlug: "science",
      threadTitle: null,
      threadSlug: null,
      platform: Platform.OWA,
      product: Product.CURRICULUM_VISUALISER,
      engagementIntent: EngagementIntent.REFINE,
      componentType: ComponentType.FILTER_LINK,
      eventVersion: EventVersion["2_0_0"],
      analyticsUseCase: AnalyticsUseCase.TEACHER,
      childSubjectSlug: null,
      childSubjectName: null,
      phase: Phase.SECONDARY,
      learningTier: null,
      subjectCategory: null,
      pathway: null,
    });
  });

  it("should include year group filter when applied", () => {
    const filtersWithYear: CurriculumFilters = {
      ...baseFilters,
      years: ["10"],
    };

    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      filtersWithYear,
    );

    expect(result.yearGroupName).toBe("10");
    expect(result.yearGroupSlug).toBe("10");
    expect(result.phase).toBe("secondary");
  });

  it("should include thread filter when applied", () => {
    const filtersWithThread: CurriculumFilters = {
      ...baseFilters,
      threads: ["number-and-place-value"],
    };

    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      filtersWithThread,
    );

    expect(result.threadTitle).toBe("number-and-place-value");
    expect(result.threadSlug).toBe("number-and-place-value");
  });

  it("should include child subject filter when applied", () => {
    const filtersWithChildSubject: CurriculumFilters = {
      ...baseFilters,
      childSubjects: ["physics"],
    };

    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      filtersWithChildSubject,
    );

    expect(result.childSubjectSlug).toBe("physics");
  });

  it("should include subject category filter when selected", () => {
    const filtersWithSubjectCategory: CurriculumFilters = {
      ...baseFilters,
      subjectCategories: ["Combined Science"],
    };

    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      filtersWithSubjectCategory,
    );

    expect(result.subjectCategory).toBe("Combined Science");
  });

  it("should set phase to Secondary when phaseSlug is secondary", () => {
    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      baseFilters,
    );

    expect(result.phase).toBe(Phase.SECONDARY);
  });

  it("should set learningTier to Foundation when selected", () => {
    const filtersWithFoundationTier: CurriculumFilters = {
      ...baseFilters,
      tiers: ["foundation"],
    };

    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      filtersWithFoundationTier,
    );

    expect(result.learningTier).toBe(LearningTier.FOUNDATION);
  });

  it("should set learningTier to Higher when selected", () => {
    const filtersWithHigherTier: CurriculumFilters = {
      ...baseFilters,
      tiers: ["higher"],
    };

    const result = buildUnitSequenceRefinedAnalytics(
      AnalyticsUseCase.TEACHER,
      mockTrackingData,
      filtersWithHigherTier,
    );

    expect(result.learningTier).toBe(LearningTier.HIGHER);
  });
});
