"use client";
import { OakSpan } from "@oaknational/oak-components";
import styled from "styled-components";

import {
  Header,
  LargeHeaderProps,
} from "@/components/TeacherComponents/Header/Header";
import { LessonHeaderNavFooter } from "@/components/TeacherComponents/HeaderNavFooter/LessonHeaderNavFooter/LessonHeaderNavFooter";
import { resolveOakHref } from "@/common-lib/urls";
import { TeachersLessonOverviewAdjacentLesson } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { getBreakpoint } from "@/styles/utils/responsive";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type LessonHeaderProps = Omit<LargeHeaderProps, "layoutVariant"> & {
  currentLessonSlug: string;
  prevLesson: TeachersLessonOverviewAdjacentLesson | null;
  nextLesson: TeachersLessonOverviewAdjacentLesson | null;
  programmeSlug: string;
  unitSlug: string;
  loginRequired: boolean;
  georestricted: boolean;
};

const LessonHeader = (props: LessonHeaderProps) => {
  const {
    prevLesson,
    nextLesson,
    unitSlug,
    programmeSlug,
    currentLessonSlug,
    loginRequired,
    georestricted,
  } = props;
  const { lessonResourceDownloadStarted } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );

  return (
    <>
      <Header
        {...props}
        layoutVariant="large"
        backgroundColorLevel={1}
        useSubduedBackground
      />
      <LessonHeaderNavFooter
        backgroundColorLevel={1}
        viewHref={resolveOakHref({
          page: "unit-overview",
          unitSlug,
          programmeSlug,
        })}
        prevHref={
          prevLesson
            ? resolveOakHref({
                page: "lesson-overview",
                lessonSlug: prevLesson.lessonSlug,
                programmeSlug,
                unitSlug,
              })
            : undefined
        }
        nextHref={
          nextLesson
            ? resolveOakHref({
                page: "lesson-overview",
                lessonSlug: nextLesson.lessonSlug,
                unitSlug,
                programmeSlug,
              })
            : undefined
        }
        downloadButton={
          <LoginRequiredButton
            rel="nofollow"
            loginRequired={loginRequired}
            geoRestricted={georestricted}
            onboardingProps={{ name: "Onboard to download" }}
            signUpProps={{ name: "Sign in to download" }}
            actionProps={{
              name: (
                <OakSpan>
                  Download <DesktopButtonText>all resources</DesktopButtonText>
                </OakSpan>
              ),
              onClick: () => {
                lessonResourceDownloadStarted("all");
              },
              isActionGeorestricted: true,
              shouldHidewhenGeoRestricted: true,
              href: resolveOakHref({
                page: "lesson-downloads",
                lessonSlug: currentLessonSlug,
                programmeSlug,
                unitSlug,
                query: { preselected: "all" },
              }),
            }}
            sizeVariant="large"
            element={"a"}
            data-testid="download-all-button"
            iconName="download"
            isTrailingIcon
          />
        }
      />
    </>
  );
};

const DesktopButtonText = styled(OakSpan)`
  display: none;
  @media (min-width: ${getBreakpoint("large")}px) {
    display: unset;
  }
`;

export default LessonHeader;
