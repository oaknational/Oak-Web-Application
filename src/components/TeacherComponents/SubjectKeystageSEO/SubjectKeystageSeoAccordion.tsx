import {
  OakBasicAccordion,
  OakFlex,
  OakLI,
  OakLink,
  OakSpan,
  OakUL,
} from "@oaknational/oak-components";
import { useRef } from "react";

import { resolveOakHref } from "@/common-lib/urls";
import { KeyStageSlug } from "@/utils/curriculum/types";
import { useContentVisibleOnClick } from "@/hooks/useContentVisibleOnClick";

export const SubjectKeystageSeoAccordion = ({
  keystageSlug,
  links,
}: {
  keystageSlug: KeyStageSlug;
  links: Array<{ href: string; label: string }>;
}) => {
  const seoContent = textContentMap[keystageSlug];
  const accordionContentRef = useRef<HTMLDivElement>(null);
  const { contentVisible } = useContentVisibleOnClick(accordionContentRef);

  return (
    <OakBasicAccordion
      id="seo-accordion"
      $gap={"spacing-0"}
      header={
        <OakSpan $textAlign={"left"}>
          Our curriculum plans for pupils aged {pupilAgesMap[keystageSlug]} make
          it easy for teachers to view the full sequence for every national
          {contentVisible ? "" : "..."}
        </OakSpan>
      }
      $alignItems="flex-start"
    >
      <OakFlex
        $flexDirection="column"
        $gap="spacing-16"
        ref={accordionContentRef}
        $overflow="hidden"
      >
        {seoContent}
        <OakUL $flexDirection="column">
          {links.map((link) => (
            <OakLI key={link.label}>
              <OakLink href={link.href}>{link.label}</OakLink>
            </OakLI>
          ))}
        </OakUL>
      </OakFlex>
    </OakBasicAccordion>
  );
};

const pupilAgesMap = {
  ks1: "5 to 7",
  ks2: "7 to 11",
  ks3: "11 to 14 in secondary and middle school",
  ks4: "14 to 16",
};

const textContentMap = {
  ks1: (
    <>
      <OakSpan>
        curriculum subject along with resources for every lesson. The{" "}
        <OakLink href={resolveOakHref({ page: "curriculum-landing-page" })}>
          KS1 curriculum
        </OakLink>{" "}
        was developed with primary and infant pupils in mind, considering the
        cross-subject sequencing essential for lesson planning and teaching.
      </OakSpan>
      <OakSpan>
        Find a subject, browse our units and lessons and download the free
        resources you need for a high-quality head start to your lesson
        planning. Additionally, you can use our AI-powered lesson assistant,
        Aila, to help you plan and develop your KS1 lesson. Key stage 1 (KS1) is
        a phase of primary or infant school education which covers year 1 and
        year 2 for children aged 5 to 7. For years 1 and 2, pupils in key stage
        1 (KS1), we offer free lesson planning resources and teaching resources
        in:
      </OakSpan>
    </>
  ),
  ks2: (
    <>
      <OakSpan>
        curriculum subject along with resources for every lesson. The{" "}
        <OakLink href={resolveOakHref({ page: "curriculum-landing-page" })}>
          KS2 curriculum
        </OakLink>{" "}
        was developed with primary, junior, and middle school pupils in mind,
        considering the cross-subject sequencing essential for effective lesson
        planning and teaching.
      </OakSpan>
      <OakSpan>
        For Year 6, our resources also support preparation for KS2 SATs. Find a
        subject, browse our units and lessons and download the free resources
        you need for a high-quality head start to your lesson planning.
        Additionally, you can use our AI-powered lesson assistant, Aila, to help
        you plan and develop your KS2 lesson. Key stage 2 (KS2) is normally a
        phase of primary or junior school which covers years 3, 4, 5 and 6 for
        children aged 7 to 11. In some areas of England, upper key stage 2 is
        delivered in middle schools. For years 3, 4, 5 and 6 pupils in key stage
        2 (KS2), we offer free lesson planning resources and teaching resources
        in:
      </OakSpan>
    </>
  ),
  ks3: (
    <>
      <OakSpan>
        curriculum subject along with resources for every lesson. The{" "}
        <OakLink href={resolveOakHref({ page: "curriculum-landing-page" })}>
          KS3 curriculum
        </OakLink>{" "}
        was developed with secondary and middle school pupils in mind,
        considering the cross-subject sequencing essential for lesson planning
        and teaching.
      </OakSpan>
      <OakSpan>
        Find a subject, browse our units and lessons and download the free
        resources you need for a high-quality head start to your lesson
        planning. Additionally, you can use our AI-powered lesson assistant,
        Aila, to help you plan and develop your KS3 lesson. Key stage 3 (KS3) is
        normally a phase of secondary school education which covers years 7, 8
        and 9 for children aged 11 to 14. Sometimes years 7 and 8 are delivered
        in middle schools. For year 7, 8 and 9 pupils in key stage 3 (KS3) we
        offer free lesson planning resources and teaching resources in:
      </OakSpan>
    </>
  ),
  ks4: (
    <>
      <OakSpan>
        curriculum subject along with resources for every lesson. The{" "}
        <OakLink href={resolveOakHref({ page: "curriculum-landing-page" })}>
          KS4 curriculum
        </OakLink>{" "}
        was developed with secondary school pupils in mind, considering the
        cross-subject sequencing essential for lesson planning and teaching.
      </OakSpan>
      <OakSpan>
        Find a subject, browse our units and lessons and download the free
        resources you need for a high-quality head start to your lesson
        planning. Additionally, you can use our AI-powered lesson assistant,
        Aila, to help you plan and develop your KS4 lesson. Key stage 4 (KS4) is
        a phase of secondary school education which covers years 10 and 11 for
        children aged 14 to 16. For year 10 and 11 pupils in key stage 4 (KS4),
        we offer free lesson planning resources and teaching resources in:
      </OakSpan>
    </>
  ),
};
