import {
  Platform,
  Product,
  EngagementIntent,
  EventVersion,
  AnalyticsUseCase,
  ComponentTypeValueType,
  AboutUsAccessedProperties,
  AboutUsContactInitiatedProperties,
  AboutUsExploredProperties,
} from "@/browser-lib/avo/Avo";

export function buildAboutUsAccessedAnalytics(
  componentType: ComponentTypeValueType,
): AboutUsAccessedProperties {
  return {
    platform: Platform.OWA,
    product: Product.ABOUT_US,
    engagementIntent: EngagementIntent.EXPLORE,
    componentType,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: AnalyticsUseCase.TEACHER,
  };
}

export function buildAboutUsContactInitiatedAnalytics(
  componentType: ComponentTypeValueType,
): AboutUsContactInitiatedProperties {
  return {
    platform: Platform.OWA,
    product: Product.ABOUT_US,
    engagementIntent: EngagementIntent.USE,
    componentType,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: AnalyticsUseCase.TEACHER,
  };
}

export function buildAboutUsExploredAnalytics(
  componentType: ComponentTypeValueType,
): AboutUsExploredProperties {
  return {
    platform: Platform.OWA,
    product: Product.ABOUT_US,
    engagementIntent: EngagementIntent.EXPLORE,
    componentType,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: AnalyticsUseCase.TEACHER,
  };
}
