import {
  Platform,
  Product,
  EngagementIntent,
  EventVersion,
  AnalyticsUseCase,
  ComponentTypeValueType,
  AboutUsContactInitiatedProperties,
  AboutUsExploredProperties,
  AboutUsAccessedProperties
} from "@/browser-lib/avo/Avo";


export const buildAboutUsContactInitiatedAnalytics = (componentType: ComponentTypeValueType): AboutUsContactInitiatedProperties => (
  {
    platform: Platform.OWA,
    product: Product.ABOUT_US,
    engagementIntent: EngagementIntent.USE,
    componentType,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: AnalyticsUseCase.TEACHER,
  }
);

export const buildAboutUsExploredAnalytics = (componentType: ComponentTypeValueType): AboutUsExploredProperties => (
  {
    platform: Platform.OWA,
    product: Product.ABOUT_US,
    engagementIntent: EngagementIntent.EXPLORE,
    componentType,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: AnalyticsUseCase.TEACHER,
  }
);

export const buildAboutUsAccessedAnalytics = (componentType: ComponentTypeValueType): AboutUsAccessedProperties => (
  {
    platform: Platform.OWA,
    product: Product.ABOUT_US,
    engagementIntent: EngagementIntent.EXPLORE,
    componentType,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: AnalyticsUseCase.TEACHER,
  }
);
