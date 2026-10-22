import {
  OakMaxWidth,
  OakFlex,
  OakBreadcrumbs,
  OakGrid,
  OakGridArea,
  OakBreadcrumbsProps,
} from "@oaknational/oak-components";

import { ShortReadsContentsNav } from "./ShortReadsContentsNav/ShortReadsContentsNav";
import { ShortReadsHeading } from "./ShortReadsHeading/ShortReadsHeading";
import { ExplanationInANutshell } from "./ExplanationInANutshell/ExplanationInANutshell";
import { CheckForUnderstandingInANutshell } from "./CheckForUnderstandingInANutshell/CheckForUnderstandingInANutshell";
import { PracticeInANutshell } from "./PracticeInANutshell/PracticeInANutshell";
import { FeedbackInANutshell } from "./FeedbackInANutshell/FeedbackInANutshell";

export function ShortReadsView() {
  const breadcrumbs: OakBreadcrumbsProps["breadcrumbs"] = [
    { text: "Teach with Oak", href: "/teachers/teach-with-oak" },
    { text: "The thinking behind Oak lessons" },
  ];
  return (
    <>
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
        $height={"auto"}
        $ph={["spacing-16", "spacing-12", "spacing-12"]}
      >
        <OakGrid $position={"relative"}>
          <ShortReadsContentsNav />
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
                <ShortReadsHeading />
                <ExplanationInANutshell />
                <CheckForUnderstandingInANutshell />
                <PracticeInANutshell />
                <FeedbackInANutshell />
              </OakFlex>
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </>
  );
}
