import React, { FC } from "react";
import {
  OakColorFilterToken,
  OakColorToken,
  OakSmallSecondaryButtonWithDropdown,
} from "@oaknational/oak-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { TeacherShareNotesButton } from "../TeacherShareNotesButton/TeacherShareNotesButton";
import { LessonOverviewHeaderShareAllButton } from "../LessonOverviewHeaderShareAllButton";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import { LessonOverviewHeaderMobile } from "@/components/TeacherComponents/LessonOverviewHeaderMobile";
import { LessonOverviewHeaderDesktop } from "@/components/TeacherComponents/LessonOverviewHeaderDesktop";
import {
  AnalyticsUseCaseValueType,
  TeachingMaterialTypeValueType,
} from "@/browser-lib/avo/Avo";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { TeacherNotesButtonProps } from "@/pages-helpers/teacher/useLesson/useLesson";
import { LessonBrowseDataByKs } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

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
  background: OakColorToken;
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
  teacherShareButtonProps?: TeacherNotesButtonProps;
  // AI
  excludedFromTeachingMaterials?: boolean;
  trackTeachingMaterialsSelected?: (
    teachingMaterialType: TeachingMaterialTypeValueType,
  ) => void;
  trackCreateWithAiButtonClicked?: () => void;
  subjectCategories?: Array<string | number | null> | null;
  actions?: LessonBrowseDataByKs["actions"];
};

const LessonOverviewHeader: FC<LessonOverviewHeaderProps> = (props) => {
  const {
    breadcrumbs,
    background,
    teacherShareButtonProps,
    showShare,
    excludedFromTeachingMaterials,
  } = props;

  const isCreateWithAiEnabled =
    useFeatureFlagVariantKey("create-with-ai-button") === "test" &&
    !excludedFromTeachingMaterials;

  const shouldUseDropdown =
    isCreateWithAiEnabled && showShare && teacherShareButtonProps;

  const shareButtons = shouldUseDropdown ? (
    <OakSmallSecondaryButtonWithDropdown primaryActionText={"Share lesson"}>
      <LessonOverviewHeaderShareAllButton variant="dropdown" {...props} />
      <TeacherShareNotesButton
        variant="dropdown"
        {...teacherShareButtonProps}
      />
    </OakSmallSecondaryButtonWithDropdown>
  ) : (
    <>
      {showShare && <LessonOverviewHeaderShareAllButton {...props} />}
      {teacherShareButtonProps && (
        <TeacherShareNotesButton {...teacherShareButtonProps} />
      )}
    </>
  );

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <LessonOverviewHeaderDesktop {...props} shareButtons={shareButtons} />
      <LessonOverviewHeaderMobile {...props} shareButtons={shareButtons} />
    </LessonHeaderWrapper>
  );
};

export default LessonOverviewHeader;
