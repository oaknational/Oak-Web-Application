import { OAK_PAGES } from "../../common-lib/urls";
import { AnalyticsUseCaseValueType, PageNameValueType } from "../avo/Avo";

import getAnalyticsUseCase from "./getAnalyticsUseCase";

type PageViewProps = {
  pageName: PageNameValueType;
  analyticsUseCase: AnalyticsUseCaseValueType;
};
export const getPageViewProps = (href: string): PageViewProps => {
  const pageViewProps = Object.values(OAK_PAGES).reduce(
    (acc, config) => {
      const [path] = href.split("?");
      if (!path) {
        return acc;
      }
      const matchResult = config.matchHref(path);
      if (!matchResult) {
        // Page not found
        return acc;
      }

      if (config.configType === "external") {
        // Page is external (this should not be the case, as we can't track page views on pages outside this application)
        return acc;
      }
      const pageViewProps: PageViewProps = {
        pageName: config.analyticsPageName,
        /**
         * In Avo, analyticsUseCase is often non-optional, but only given
         * specific contexts.
         * E.g. in "Lesson selected", analyticsUseCase must be Teacher/Pupil
         * however, for "$pageview", analyticsUseCase may be null.
         */
        analyticsUseCase: null as unknown as AnalyticsUseCaseValueType,
      };

      const params = matchResult.params;

      const viewType = "viewType" in params ? params.viewType : null;

      if (viewType === "teachers" || viewType === "pupils") {
        const analyticsUseCase = getAnalyticsUseCase(viewType);
        pageViewProps.analyticsUseCase = analyticsUseCase;
      }

      return pageViewProps;
    },
    {
      pageName: null as unknown as PageNameValueType,
      analyticsUseCase: null as unknown as AnalyticsUseCaseValueType,
    }
  );

  return pageViewProps;
};
