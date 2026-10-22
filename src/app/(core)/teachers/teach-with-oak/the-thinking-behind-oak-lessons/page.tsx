"use client";

import {
  OakBreadcrumbs,
  OakBreadcrumbsProps,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakTertiaryOLNav,
} from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { notFound } from "next/navigation";

import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

const ShortReadsPage = () => {
  const breadcrumbs: OakBreadcrumbsProps["breadcrumbs"] = [
    { text: "Teach with Oak", href: "/teachers/teach-with-oak" },
    { text: "The thinking behind Oak lessons" },
  ];

  const featureFlagEnabled =
    useFeatureFlagEnabled("teachers-thinking-behind-oak-lessons") ?? false;
  if (!featureFlagEnabled) return notFound();

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <OakMaxWidth>
        <OakFlex
          $pt={"spacing-24"}
          $ml={["spacing-16", "spacing-0", "spacing-0"]}
          $pb={["spacing-48", "spacing-48", "spacing-72"]}
        >
          <OakBreadcrumbs breadcrumbs={breadcrumbs} />
        </OakFlex>
      </OakMaxWidth>
      <OakMaxWidth
        $display={["flex", "flex", "none"]}
        $ph={["spacing-16", "spacing-12", "spacing-12"]}
      >
        <OakFlex
          $flexDirection={"column"}
          $pt="spacing-24"
          $pb="spacing-24"
          $width={"100%"}
          $maxWidth={["100%", "spacing-640", "spacing-640"]}
          $mh="auto"
        >
          <OakHeading
            id="short-read-contents-mobile"
            tag="h2"
            $font="heading-light-7"
            $mb={"spacing-24"}
          >
            Contents
          </OakHeading>
          <OakTertiaryOLNav
            items={[
              { title: "Explanation", href: "#explanation" },
              {
                title: "Check for understanding",
                href: "#check-for-understanding",
              },
              { title: "Practice", href: "#practice" },
              { title: "Feedback", href: "#feedback" },
            ]}
            aria-labelledby="short-read-contents-mobile"
            anchorTarget={"the-thinking-behind-oak-lessons-contents"}
          />
        </OakFlex>
      </OakMaxWidth>
      <OakMaxWidth
        $height={"auto"}
        $ph={["spacing-16", "spacing-12", "spacing-12"]}
      >
        <OakGrid $position={"relative"}>
          <OakGridArea
            $colSpan={[12, 3]}
            $alignSelf={"start"}
            $position={["static", "static", "sticky"]}
            $top={"spacing-56"}
            $display={["none", "none", "block"]}
            $maxWidth={[null, "spacing-640", "spacing-640"]}
          >
            <OakHeading
              id="short-read-contents"
              tag="h2"
              $font="heading-light-7"
              $mb={"spacing-24"}
            >
              Contents
            </OakHeading>
            <OakTertiaryOLNav
              items={[
                { title: "Explanation", href: "#explanation" },
                {
                  title: "Check for understanding",
                  href: "#check-for-understanding",
                },
                { title: "Practice", href: "#practice" },
                { title: "Feedback", href: "#feedback" },
              ]}
              aria-labelledby="short-read-contents"
              anchorTarget={"the-thinking-behind-oak-lessons-contents"}
            />
          </OakGridArea>

          <OakGridArea
            $colSpan={[12, 12, 6]}
            $colStart={[1, 1, 5]}
            $justifyContent={"center"}
          >
            <OakFlex
              $width={"100%"}
              $flexDirection={"column"}
              $alignItems={["flex-start", "center", "center"]}
            >
              <OakFlex
                $minWidth={[null, null, "spacing-640"]}
                $maxWidth={[null, "spacing-640", "spacing-640"]}
                $width={"100%"}
                $flexDirection={"column"}
              >
                <OakHeading
                  $font={["heading-4", "heading-3", "heading-2"]}
                  tag="h1"
                  $mb={"spacing-48"}
                >
                  The thinking behind Oak lessons
                </OakHeading>
                <OakP $mb={"spacing-48"}>
                  See how our lessons are designed to support learning - and
                  make the most of them in your classroom.
                </OakP>
                <OakHeading
                  $font={["heading-5", "heading-4", "heading-4"]}
                  tag="h2"
                  $mb={"spacing-32"}
                  id="explanation"
                >
                  Explanation in a nutshell
                </OakHeading>
                <OakP $mb={"spacing-32"}>
                  Explore Oak's approach to explanation and the thinking behind
                  our design, with questions to help you reflect on what this
                  means for your classroom.
                </OakP>
                <OakHeading
                  $font={["heading-7", "heading-6", "heading-6"]}
                  tag="h3"
                  $mb={"spacing-16"}
                >
                  What?
                </OakHeading>
                <OakP $mb={"spacing-32"}>
                  Explanation is a pedagogical strategy that presents new
                  knowledge to pupils and connects it with what they already
                  know.
                </OakP>
                <OakHeading
                  $font={["heading-7", "heading-6", "heading-6"]}
                  tag="h3"
                  $mb={"spacing-16"}
                >
                  Why?
                </OakHeading>
                <OakP $mb={"spacing-32"}>
                  Effective explanation makes new knowledge clear and
                  manageable, helping pupils build secure understanding.
                </OakP>
                <OakHeading
                  $font={["heading-5", "heading-4", "heading-4"]}
                  tag="h2"
                  $mb={"spacing-32"}
                  id="check-for-understanding"
                >
                  Check for understanding in a nutshell
                </OakHeading>
                <OakHeading
                  $font={["heading-5", "heading-4", "heading-4"]}
                  tag="h2"
                  $mb={"spacing-32"}
                  id="practice"
                >
                  Practice in a nutshell
                </OakHeading>
                <OakHeading
                  $font={["heading-5", "heading-4", "heading-4"]}
                  tag="h2"
                  $mb={"spacing-32"}
                  id="feedback"
                >
                  Feedback in a nutshell
                </OakHeading>
              </OakFlex>
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default ShortReadsPage;
