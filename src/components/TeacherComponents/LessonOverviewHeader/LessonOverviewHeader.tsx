import React, { FC } from "react";
import { OakColorFilterToken } from "@oaknational/oak-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import {
  LessonOverviewHeaderMobile,
  LessonOverviewHeaderMobileB,
} from "@/components/TeacherComponents/LessonOverviewHeaderMobile";
import {
  LessonOverviewHeaderDesktop,
  LessonOverviewHeaderDesktopB,
} from "@/components/TeacherComponents/LessonOverviewHeaderDesktop";
import { OakColorName } from "@/styles/theme";
import { AnalyticsUseCaseValueType } from "@/browser-lib/avo/Avo";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

/**
 * This is a header for the lesson overview page.
 *
 */

export type LessonOverviewHeaderProps = {
  // pathway props
  subjectSlug: string | null;
  yearTitle?: string | null;
  examBoardTitle?: string | null;
  tierTitle?: string | null;
  unitSlug: string | null;
  keyStageSlug?: string | null;
  keyStageTitle?: string | null;
  unitTitle: string | null;
  subjectTitle: string | null;
  programmeSlug: string | null;
  // lesson base props
  lessonTitle: string;
  expired?: boolean | null;
  lessonSlug: string;
  lessonDescription?: string;
  phonicsOutcome?: string | null;
  isSpecialist: boolean;
  isCanonical: boolean;
  orderInUnit?: number | null;
  unitTotalLessonCount?: number | null;
  geoRestricted?: boolean;
  loginRequired?: boolean;
  isLegacy?: boolean;
  lessonReleaseDate?: string | null;
  // other props
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
  isNew: boolean;
  isShareable: boolean;
  subjectIconBackgroundColor: OakColorFilterToken;
  track: TrackFns;
  analyticsUseCase: AnalyticsUseCaseValueType;
  pupilLessonOutcome?: string | null;
  onClickDownloadAll: () => void;
  onClickShareAll: () => void;
  showDownloadAll: boolean;
  showShare: boolean;
  // teacher share
  teacherShareButton?: React.ReactNode;
  // AI
  excludedFromTeachingMaterials: boolean;
};

const LessonOverviewHeader: FC<LessonOverviewHeaderProps> = (props) => {
  const { breadcrumbs, background } = props;
  const isSignpostExperiment =
    useFeatureFlagVariantKey("lesson-overview-signposting-experiment") ===
    "test";
  const DesktopHeader = isSignpostExperiment
    ? LessonOverviewHeaderDesktopB
    : LessonOverviewHeaderDesktop;
  const MobileHeader = isSignpostExperiment
    ? LessonOverviewHeaderMobileB
    : LessonOverviewHeaderMobile;
  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <DesktopHeader {...props} />
      <MobileHeader {...props} />
    </LessonHeaderWrapper>
  );
};

export default LessonOverviewHeader;
