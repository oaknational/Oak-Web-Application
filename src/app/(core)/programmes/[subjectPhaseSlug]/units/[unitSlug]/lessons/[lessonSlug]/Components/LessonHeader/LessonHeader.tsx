"use client";
import { OakSpan } from "@oaknational/oak-components";
import styled from "styled-components";

import {
  Header,
  LargeHeaderProps,
} from "@/components/TeacherComponents/Header/Header";
import HeaderNavFooter from "@/components/TeacherComponents/HeaderNavFooter/HeaderNavFooter";
import { resolveOakHref } from "@/common-lib/urls";
import { TeachersLessonOverviewAdjacentLesson } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { getBreakpoint } from "@/styles/utils/responsive";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";

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

  return (
    <>
      <Header
        {...props}
        layoutVariant="large"
        backgroundColorLevel={1}
        useSubduedBackground
      />
      <HeaderNavFooter
        type="lesson"
        backgroundColorLevel={1}
        viewHref={resolveOakHref({
          page: "integrated-unit-overview",
          unitSlug,
          programmeSlug,
        })}
        prevHref={
          prevLesson
            ? resolveOakHref({
                page: "integrated-lesson-overview",
                lessonSlug: prevLesson.lessonSlug,
                programmeSlug,
                unitSlug,
              })
            : undefined
        }
        nextHref={
          nextLesson
            ? resolveOakHref({
                page: "integrated-lesson-overview",
                lessonSlug: nextLesson.lessonSlug,
                unitSlug,
                programmeSlug,
              })
            : undefined
        }
        actionButton={
          <LoginRequiredButton
            rel="nofollow"
            loginRequired={loginRequired}
            geoRestricted={georestricted}
            onboardingProps={{ name: "Download all" }}
            signUpProps={{ name: "Download all" }}
            actionProps={{
              name: (
                <OakSpan>
                  Download <DesktopButtonText>all resources</DesktopButtonText>
                </OakSpan>
              ),
              isActionGeorestricted: true,
              shouldHidewhenGeoRestricted: true,
              href: resolveOakHref({
                page: "lesson-downloads",
                lessonSlug: currentLessonSlug,
                programmeSlug,
                unitSlug,
                downloads: "downloads",
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
