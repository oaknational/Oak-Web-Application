import {
  Platform,
  Product,
  EngagementIntent,
  EventVersion,
  AnalyticsUseCaseValueType,
  ComponentTypeValueType,
  AboutUsContactInitiatedProperties
} from "@/browser-lib/avo/Avo";


export const buildAboutUsContactInitiatedAnalytics = ({
  componentType,
  analyticsUseCase,
}: {
  componentType: ComponentTypeValueType;
  analyticsUseCase: AnalyticsUseCaseValueType;
}): AboutUsContactInitiatedProperties => (
  {
    platform: Platform.OWA,
    product: Product.ABOUT_US,
    engagementIntent: EngagementIntent.USE, // or could it be .EXPLORE ?
    componentType,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase,
  }
);

