import { Thread, Unit } from "./types";
import { areLessonsAvailable } from "./lessons";

import {
  AnalyticsUseCaseValueType,
  UnitOverviewAccessedProperties,
  AccessLevelValueType,
  NavigationTypeValueType,
} from "@/browser-lib/avo/Avo";

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
  journeyId: string | null;
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
