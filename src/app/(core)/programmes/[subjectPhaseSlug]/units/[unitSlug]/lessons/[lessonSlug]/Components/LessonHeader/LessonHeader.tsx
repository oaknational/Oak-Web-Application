"use client";
import { OakPrimaryButton, useMediaQuery } from "@oaknational/oak-components";
import Link from "next/link";

import {
  Header,
  LargeHeaderProps,
} from "@/components/TeacherComponents/Header/Header";
import HeaderNavFooter from "@/components/TeacherComponents/HeaderNavFooter/HeaderNavFooter";
import { resolveOakHref } from "@/common-lib/urls";
import { TeachersLessonOverviewAdjacentLesson } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

export type LessonHeaderProps = Omit<LargeHeaderProps, "layoutVariant"> & {
  currentLessonSlug: string;
  prevLesson: TeachersLessonOverviewAdjacentLesson | null;
  nextLesson: TeachersLessonOverviewAdjacentLesson | null;
  programmeSlug: string;
  unitSlug: string;
};

const LessonHeader = (props: LessonHeaderProps) => {
  const { prevLesson, nextLesson, unitSlug, programmeSlug, currentLessonSlug } =
    props;
  const isDesktop = useMediaQuery("desktop");
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
                page: "teachers-lesson-overview",
                lessonSlug: prevLesson.lessonSlug,
                programmeSlug,
                unitSlug,
              })
            : undefined
        }
        nextHref={
          nextLesson
            ? resolveOakHref({
                page: "teachers-lesson-overview",
                lessonSlug: nextLesson.lessonSlug,
                unitSlug,
                programmeSlug,
              })
            : undefined
        }
        actionButton={
          <OakPrimaryButton
            iconName="download"
            isTrailingIcon
            element={Link}
            href={resolveOakHref({
              page: "lesson-downloads",
              lessonSlug: currentLessonSlug,
              programmeSlug,
              unitSlug,
              downloads: "downloads",
              query: { preselected: "all" },
            })}
          >
            {isDesktop ? "Download all resources" : "Download"}
          </OakPrimaryButton>
        }
      />
    </>
  );
};

export default LessonHeader;
