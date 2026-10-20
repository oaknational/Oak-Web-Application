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

import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

const ShortReadsPage = () => {
  const breadcrumbs: OakBreadcrumbsProps["breadcrumbs"] = [
    { text: "Teach With Oak", href: "/teachers/teach-with-oak" },
    { text: "The thinking behind Oak lessons" },
  ];

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <OakMaxWidth>
        <OakFlex
          $pt={["spacing-16"]}
          $ml={["spacing-16", "spacing-0", "spacing-0"]}
          $maxWidth={[null, "spacing-640", "spacing-640"]}
        >
          <OakBreadcrumbs breadcrumbs={breadcrumbs} />
        </OakFlex>
      </OakMaxWidth>
      <OakFlex
        $display={["block", "block", "none"]}
        $pv={"spacing-24"}
        $ml={["spacing-16", "spacing-0", "spacing-0"]}
      >
        <OakMaxWidth>
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
            ariaLabel="Contents"
            title={"Contents"}
            anchorTarget={"the-thinking-behind-oak-lessons-contents"}
          />
        </OakMaxWidth>
      </OakFlex>
      <OakMaxWidth $height={"auto"}>
        <OakGrid $mt={"spacing-48"} $position={"relative"}>
          <OakGridArea
            $colSpan={[12, 3]}
            $alignSelf={"start"}
            $position={["static", "static", "sticky"]}
            $top={"spacing-56"}
            $display={["none", "none", "block"]}
            $maxWidth={[null, "spacing-640", "spacing-640"]}
          >
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
              ariaLabel="Contents"
              title={"Contents"}
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
              $alignItems={["flex-start", "flex-start", "center"]}
            >
              <OakFlex
                $minWidth={[null, null, "spacing-640"]}
                $maxWidth={[null, "spacing-640", "spacing-640"]}
                $width={"100%"}
                $flexDirection={"column"}
              >
                <OakHeading $font="heading-2" tag="h1" $mb={"spacing-48"}>
                  The thinking behind Oak lessons
                </OakHeading>
                <OakP $mb={"spacing-48"}>
                  See how our lessons are designed to support learning - and
                  make the most of them in your classroom.
                </OakP>
                <OakHeading
                  $font="heading-4"
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
                <OakHeading $font="heading-6" tag="h3" $mb={"spacing-16"}>
                  What?
                </OakHeading>
                <OakP $mb={"spacing-32"}>
                  Explanation is a pedagogical strategy that presents new
                  knowledge to pupils and connects it with what they already
                  know.
                </OakP>
                <OakHeading $font="heading-6" tag="h3" $mb={"spacing-16"}>
                  Why?
                </OakHeading>
                <OakP $mb={"spacing-32"}>
                  Effective explanation makes new knowledge clear and
                  manageable, helping pupils build secure understanding.
                </OakP>
              </OakFlex>
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default ShortReadsPage;
