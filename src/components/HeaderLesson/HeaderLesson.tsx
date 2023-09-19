import { FC } from "react";

import { Breadcrumb } from "../Breadcrumbs";

import { HeaderWrapper } from "./HeaderWrapper";
import { HeaderLessonMobile } from "./HeaderLessonMobile";
import { HeaderLessonDesktop } from "./HeaderLessonDesktop";

import { OakColorName } from "@/styles/theme";
import { AnalyticsUseCaseValueType } from "@/browser-lib/avo/Avo";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

/**
 * This is a header for the lesson overview page.
 *
 */

export type HeaderLessonProps = {
  // pathway props
  subjectSlug: string | null;
  yearTitle: string | null;
  unitSlug: string | null;
  keyStageSlug: string | null;
  keyStageTitle: string | null;
  unitTitle: string | null;
  subjectTitle: string | null;
  programmeSlug: string | null;
  // lesson base props
  lessonTitle: string;
  expired?: boolean | null;
  hasDownloadableResources?: boolean;
  lessonSlug: string;
  lessonDescription?: string;
  // other props
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
  isNew?: boolean;
  subjectIconBackgroundColor: OakColorName;
  track: TrackFns;
  analyticsUseCase: AnalyticsUseCaseValueType;
};

const HeaderLesson: FC<HeaderLessonProps> = (props) => {
  const { breadcrumbs, background } = props;

  return (
    <HeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <HeaderLessonDesktop {...props} />
      <HeaderLessonMobile {...props} />
    </HeaderWrapper>
  );
};

export default HeaderLesson;
