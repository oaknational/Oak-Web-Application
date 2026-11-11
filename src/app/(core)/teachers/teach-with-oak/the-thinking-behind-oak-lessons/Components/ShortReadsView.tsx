import {
  OakMaxWidth,
  OakFlex,
  OakBreadcrumbs,
  OakGrid,
  OakGridArea,
  OakBreadcrumbsProps,
  OakInlineBanner,
  OakIcon,
  OakP,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import { ShortReadsNav } from "./ShortReadsNav/ShortReadsNav";
import { ShortReadsHeading } from "./ShortReadsHeading/ShortReadsHeading";
import { ExplanationInANutshell } from "./ExplanationInANutshell/ExplanationInANutshell";
import { CheckForUnderstandingInANutshell } from "./CheckForUnderstandingInANutshell/CheckForUnderstandingInANutshell";
import { PracticeInANutshell } from "./PracticeInANutshell/PracticeInANutshell";
import { FeedbackInANutshell } from "./FeedbackInANutshell/FeedbackInANutshell";

import CopyrightLicence from "@/components/TeacherComponents/CopyrightLicence/CopyrightLicence";

const FeedbackFormLink = styled(Link)`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export function ShortReadsView() {
  const breadcrumbs: OakBreadcrumbsProps["breadcrumbs"] = [
    { text: "Teach with Oak", href: "/teachers/teach-with-oak" },
    { text: "The thinking behind Oak lessons" },
  ];
  return (
    <OakMaxWidth $pt={"spacing-24"} $ph={["spacing-16", "spacing-12"]}>
      <OakBreadcrumbs breadcrumbs={breadcrumbs} />
      <OakGrid
        $position={"relative"}
        $mt={["spacing-48", "spacing-48", "spacing-72"]}
      >
        <ShortReadsNav />
        <OakGridArea
          $colSpan={[12, 12, 8]}
          $colStart={[1, 1, 4]}
          $justifyContent={"center"}
          $width={"100%"}
          $maxWidth={[null, "spacing-640", "spacing-640"]}
          $mh={"auto"}
          $mb={["spacing-56", "spacing-64", "spacing-72"]}
        >
          <ShortReadsHeading />
          <OakFlex
            $flexDirection={"column"}
            $gap={["spacing-56", "spacing-64", "spacing-80"]}
          >
            <ExplanationInANutshell />
            <CheckForUnderstandingInANutshell />
            <PracticeInANutshell />
            <FeedbackInANutshell />
            <FeedbackFormLink
              href="https://docs.google.com/forms/d/e/1FAIpQLSdEs58ApTLxRyQsDxmAaykGxTa8p6hgzgTmg1brFIPmQxJNpg/viewform?pli=1"
              target="_blank"
            >
              <OakInlineBanner
                isOpen
                message="Share your feedback with us"
                cta={
                  <OakFlex $alignItems={"center"} $gap={"spacing-8"}>
                    <OakP $font={"heading-light-7"}>
                      Fill out a feedback form
                    </OakP>
                    <OakIcon iconName="external" />
                  </OakFlex>
                }
              />
            </FeedbackFormLink>
            <CopyrightLicence copyrightYear="2026" openLinksExternally />
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakMaxWidth>
  );
}
