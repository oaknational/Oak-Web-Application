import {
  buildAboutUsAccessedAnalytics,
  buildAboutUsContactInitiatedAnalytics,
  buildAboutUsExploredAnalytics,
} from "./index";

import {
  Platform,
  Product,
  EngagementIntent,
  EventVersion,
  AnalyticsUseCase,
  ComponentTypeValueType,
} from "@/browser-lib/avo/Avo";

describe("Analytics Builders", () => {
  const mockComponentType = "a_component_type" as ComponentTypeValueType;

  describe("buildAboutUsAccessedAnalytics", () => {
    it("should build analytics object with correct properties", () => {
      const result = buildAboutUsAccessedAnalytics(mockComponentType);

      expect(result).toEqual({
        platform: Platform.OWA,
        product: Product.ABOUT_US,
        engagementIntent: EngagementIntent.EXPLORE,
        componentType: mockComponentType,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
    });
  });

  describe("buildAboutUsContactInitiatedAnalytics", () => {
    it("should build analytics object with correct properties", () => {
      const result = buildAboutUsContactInitiatedAnalytics(mockComponentType);

      expect(result).toEqual({
        platform: Platform.OWA,
        product: Product.ABOUT_US,
        engagementIntent: EngagementIntent.USE,
        componentType: mockComponentType,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
    });
  });

  describe("buildAboutUsExploredAnalytics", () => {
    it("should build analytics object with correct properties", () => {
      const result = buildAboutUsExploredAnalytics(mockComponentType);

      expect(result).toEqual({
        platform: Platform.OWA,
        product: Product.ABOUT_US,
        engagementIntent: EngagementIntent.EXPLORE,
        componentType: mockComponentType,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
    });
  });
});
