import { FC } from "react";

import { Breadcrumb } from "../Breadcrumbs";

import { HeaderWrapper } from "./HeaderWrapper";
import { HeaderLessonMobile } from "./HeaderLessonMobile";
import { HeaderLessonDesktop } from "./HeaderLessonDesktop";

import { OakColorName } from "@/styles/theme";
import { LessonOverviewData } from "@/node-lib/curriculum-api";
import { AnalyticsUseCaseValueType } from "@/browser-lib/avo/Avo";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

/**
 * This is a header for the lesson overview page.
 *
 */

export type HeaderLessonProps = LessonOverviewData & {
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
  lessonDescription?: string; // Check this is coming through from the API
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
