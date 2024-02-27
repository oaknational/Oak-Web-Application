import { FC } from "react";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import { LessonOverviewHeaderMobile } from "@/components/TeacherComponents/LessonOverviewHeaderMobile";
import { LessonOverviewHeaderDesktop } from "@/components/TeacherComponents/LessonOverviewHeaderDesktop";
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
  hasDownloadableResources: boolean;
  lessonSlug: string;
  lessonDescription?: string;
  // other props
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
  isNew: boolean;
  isShareable: boolean;
  subjectIconBackgroundColor: OakColorName;
  track: TrackFns;
  analyticsUseCase: AnalyticsUseCaseValueType;
  pupilLessonOutcome?: string | null;
  onClickDownloadAll: () => void;
  onClickShareAll: () => void;
};

const LessonOverviewHeader: FC<LessonOverviewHeaderProps> = (props) => {
  const { breadcrumbs, background } = props;

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <LessonOverviewHeaderDesktop {...props} />
      <LessonOverviewHeaderMobile {...props} />
    </LessonHeaderWrapper>
  );
};

export default LessonOverviewHeader;
