import {
  Platform,
  Product,
  EngagementIntent,
  EventVersion,
  AnalyticsUseCase,
  ComponentTypeValueType,
  AboutUsContactInitiatedProperties,
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

