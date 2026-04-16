"use client";

import { Fragment } from "react";
import { OakBox, OakGrid, OakGridArea } from "@oaknational/oak-components";

import { getLessonResources } from "./getLessonResources";
import { LessonItem } from "./LessonItem";

import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { hasLessonMathJax } from "@/components/TeacherViews/LessonOverview/hasLessonMathJax";

export default function LessonView(
  data: Readonly<TeachersLessonOverviewPageData>,
) {
  const copyRightState = useComplexCopyright({
    loginRequired: data.loginRequired,
    geoRestricted: data.geoRestricted,
  });
  const isMathJaxLesson = hasLessonMathJax(data, data.subjectSlug, false);
  const MathJaxLessonProvider = isMathJaxLesson ? MathJaxProvider : Fragment;

  const lessonResources = getLessonResources({
    downloads: data.downloads,
    data,
    copyRightState,
    isMathJaxLesson,
  });

  return (
    <MathJaxLessonProvider>
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
          <OakGridArea
            $colSpan={[12, 3]}
            $alignSelf={"start"}
            $position={"sticky"}
            $display={["none", "block"]}
            $top={"spacing-92"} // FIXME: ideally we'd dynamically calculate this based on the height of the header using the next allowed size. This could be achieved with a new helperFunction get nextAvailableSize
          >
            {/* anchor links area */}
          </OakGridArea>
          <OakGridArea $colSpan={[12, 9]} $mb={"spacing-48"}>
            {lessonResources.map((resource) => (
              <LessonItem
                slugs={{
                  lessonSlug: data.lessonSlug,
                  unitSlug: data.unitSlug,
                  programmeSlug: data.programmeSlug,
                }}
                resource={resource}
                key={resource.key}
              />
            ))}
            <PreviousNextNav
              backgroundColorLevel={1}
              currentIndex={data.orderInUnit ?? undefined}
              navItemType="lesson"
              previous={
                data.previousLesson
                  ? {
                      href: resolveOakHref({
                        page: "integrated-lesson-index",
                        programmeSlug: data.programmeSlug,
                        unitSlug: data.unitSlug,
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
                        page: "integrated-lesson-index",
                        programmeSlug: data.programmeSlug,
                        unitSlug: data.unitSlug,
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
    </MathJaxLessonProvider>
  );
}
