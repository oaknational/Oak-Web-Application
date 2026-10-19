"use client";

import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakTertiaryOLNav,
} from "@oaknational/oak-components";

import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import OakBreadcrumbs from "@/components/SharedComponents/Breadcrumbs";

const ShortReadsPage = () => {
  const breadcrumbs = [
    { label: "Teach With Oak", href: "/teachers/teach-with-oak" },
    {
      label: "The thinking behind Oak lessons",
      href: "/teachers/teach-with-oak/short-reads",
    },
  ];

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <OakMaxWidth $mv={"spacing-16"}>
        <OakBreadcrumbs breadcrumbs={breadcrumbs} />
      </OakMaxWidth>
      <OakFlex
        $display={["block", "block", "none"]}
        $pv={"spacing-24"}
        $ph={["spacing-16", "spacing-0", "spacing-0"]}
      >
        <OakMaxWidth>
          <OakTertiaryOLNav
            items={[
              { title: "Explanation", href: "" },
              { title: "Check for understanding", href: "" },
              { title: "Practice", href: "" },
              { title: "Feedback", href: "" },
            ]}
            ariaLabel="Contents"
            title={"Contents"}
            anchorTarget={"short-reads-contents"}
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
          >
            <OakTertiaryOLNav
              items={[
                { title: "Explanation", href: "" },
                { title: "Check for understanding", href: "" },
                { title: "Practice", href: "" },
                { title: "Feedback", href: "" },
              ]}
              ariaLabel="Contents"
              title={"Contents"}
              anchorTarget={"short-reads-contents"}
            />
          </OakGridArea>

          <OakGridArea
            $colSpan={[12, 12, 6]}
            $colStart={[1, 1, 5]}
            $mh={["spacing-16", null, null]}
            $justifyContent={"center"}
          >
            <OakFlex
              $width={"100%"}
              $flexDirection={"column"}
              $alignItems={"center"}
            >
              <OakFlex
                $minWidth={[null, "spacing-640"]}
                $maxWidth={"spacing-640"}
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
                <OakHeading $font="heading-4" tag="h2" $mb={"spacing-32"}>
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
