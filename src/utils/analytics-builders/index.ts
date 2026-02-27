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

const baseAboutUsAnalytics = {
  platform: Platform.OWA,
  product: Product.ABOUT_US,
  eventVersion: EventVersion["2_0_0"],
  analyticsUseCase: AnalyticsUseCase.TEACHER,
};

export const buildAboutUsAnalytics = (
  componentType: ComponentTypeValueType,
): AboutUsAccessedProperties | AboutUsExploredProperties => ({
  ...baseAboutUsAnalytics,
  componentType,
  engagementIntent: EngagementIntent.EXPLORE,
});

export const buildAboutUsContactInitiatedAnalytics = (
  componentType: ComponentTypeValueType,
): AboutUsContactInitiatedProperties => ({
  ...baseAboutUsAnalytics,
  componentType,
  engagementIntent: EngagementIntent.USE,
});
