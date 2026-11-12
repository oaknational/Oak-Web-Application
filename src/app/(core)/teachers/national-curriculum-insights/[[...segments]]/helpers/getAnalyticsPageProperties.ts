import type { NationalCurriculumInsightsRouteData } from "./getRouteData";

import { KeyStageTitle, PageName } from "@/browser-lib/avo/Avo";
import type { NationalCurriculumInsightsAnalyticsPage } from "@/context/NationalCurriculumInsightsAnalytics/NationalCurriculumInsightsAnalyticsProvider";

const keyStageTitles = {
  "key-stage-1": KeyStageTitle.KEY_STAGE_1,
  "key-stage-2": KeyStageTitle.KEY_STAGE_2,
  "key-stage-3": KeyStageTitle.KEY_STAGE_3,
  "key-stage-4": KeyStageTitle.KEY_STAGE_4,
};

export function getAnalyticsPageProperties({
  route,
  subject,
}: NationalCurriculumInsightsRouteData): NationalCurriculumInsightsAnalyticsPage {
  return {
    pageName: PageName.NC_INSIGHTS,
    pageType: route.kind,
    subjectTitle: subject?.title ?? null,
    subjectSlug: subject?.slug ?? null,
    phase:
      route.kind === "subjectPhase" || route.kind === "subjectPhaseKeyStage"
        ? route.phase
        : null,
    keyStageTitle:
      route.kind === "subjectPhaseKeyStage"
        ? keyStageTitles[route.keyStageSlug]
        : null,
    keyStageSlug:
      route.kind === "subjectPhaseKeyStage" ? route.keyStageSlug : null,
  };
}
