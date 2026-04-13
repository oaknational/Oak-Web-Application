"use client";

import { OakBox, OakGrid, OakGridArea } from "@oaknational/oak-components";

import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

export default function LessonView({
  programmeSlug,
  unitSlug,
  ...data
}: Readonly<TeachersLessonOverviewPageData>) {
  return (
    <OakBox $ph="spacing-40">
      <OakGrid
        $cg="spacing-16"
        $rg="spacing-56"
        $mb={["spacing-0", "spacing-48", "spacing-48"]}
        $mh="auto"
        $mt={["spacing-48", "spacing-56"]}
        $width={"100%"}
        $maxWidth={"spacing-1280"}
      >
        <OakGridArea $colSpan={12} $rowStart={[3, 2]} $mb={"spacing-48"}>
          <PreviousNextNav
            backgroundColorLevel={1}
            currentIndex={data.orderInUnit ?? undefined}
            navItemType="lesson"
            previous={
              data.previousLesson
                ? {
                    href: resolveOakHref({
                      page: "lesson-page",
                      programmeSlug,
                      unitSlug,
                      lessonSlug: data.previousLesson.lessonSlug,
                    }),
                    title: data.previousLesson.lessonTitle,
                    index: data.previousLesson.lessonIndex,
                  }
                : undefined
            }
            next={
              data.nextLesson
                ? {
                    href: resolveOakHref({
                      page: "lesson-page",
                      programmeSlug,
                      unitSlug,
                      lessonSlug: data.nextLesson.lessonSlug,
                    }),
                    title: data.nextLesson.lessonTitle,
                    index: data.nextLesson.lessonIndex,
                  }
                : undefined
            }
          />
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
}
