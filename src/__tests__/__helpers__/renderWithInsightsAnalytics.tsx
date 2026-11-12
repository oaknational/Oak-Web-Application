import { render } from "@testing-library/react";
import type { ReactNode } from "react";

import renderWithTheme, { AllTheProviders } from "./renderWithTheme";

import { analyticsContext } from "@/context/Analytics/AnalyticsProvider";
import { getMockAnalytics } from "@/context/Analytics/getMockAnalytics";
import { NationalCurriculumInsightsAnalyticsProvider } from "@/context/NationalCurriculumInsightsAnalytics/NationalCurriculumInsightsAnalyticsProvider";

/** Supplies the same feature context standalone sections receive in the page. */
export default function renderWithInsightsAnalytics(
  ...args: Parameters<typeof renderWithTheme>
) {
  const [ui, options, providerProps] = args;
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders {...providerProps}>
      <analyticsContext.Provider value={getMockAnalytics()}>
        <NationalCurriculumInsightsAnalyticsProvider
          page={{
            pageName: "NC Insights",
            pageType: "hub",
            subjectSlug: null,
            subjectTitle: null,
            phase: null,
            keyStageSlug: null,
            keyStageTitle: null,
          }}
        >
          {children}
        </NationalCurriculumInsightsAnalyticsProvider>
      </analyticsContext.Provider>
    </AllTheProviders>
  );
  return render(ui, { ...options, wrapper });
}
