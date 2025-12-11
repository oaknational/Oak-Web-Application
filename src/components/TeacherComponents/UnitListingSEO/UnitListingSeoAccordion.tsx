import {
  OakBasicAccordion,
  OakFlex,
  OakLink,
  OakSpan,
} from "@oaknational/oak-components";

import { formatSubjectName } from "../helpers/seoTextHelpers/seoText.helpers";

import { resolveOakHref } from "@/common-lib/urls";
import { useContentVisibleOnClick } from "@/hooks/useContentVisibleOnClick";
import { KeystageSlug } from "@/node-lib/curriculum-api-2023/shared.schema";

export const UnitListingSeoAccordion = ({
  keystageSlug,
  subject,
  subjectSlug,
  keystageTitle,
  subjectPhaseSlug,
  hasSubjectCategories,
}: {
  keystageSlug: KeystageSlug;
  subject: string;
  subjectSlug: string;
  keystageTitle: string;
  subjectPhaseSlug: string;
  hasSubjectCategories: boolean;
}) => {
  const { contentVisible, contentRef: accordionContentRef } =
    useContentVisibleOnClick();
  if (
    keystageSlug === "early-years-foundation-stage" ||
    keystageSlug === "all-ks"
  ) {
    return null;
  }

  const years = keyStageYearsMap[keystageSlug];

  // RSHE is not available in the curriculum visualiser so don't link to it
  const hideCurriculumLinks = subjectSlug === "rshe-pshe";
  const finalLine = hideCurriculumLinks ? null : (
    <>
      Read more about how the{" "}
      <OakLink
        href={resolveOakHref({
          page: "curriculum-units",
          subjectPhaseSlug,
          query: hasSubjectCategories
            ? {
                subject_categories: subjectSlug,
              }
            : undefined,
        })}
      >
        {keystageSlug.toUpperCase()} curriculum
      </OakLink>{" "}
      was designed in our{" "}
      <OakLink
        href={resolveOakHref({
          page: "curriculum-overview",
          subjectPhaseSlug,
        })}
      >
        explainer
      </OakLink>
      .
    </>
  );

  return (
    <OakBasicAccordion
      id="units-seo-accordion"
      $gap={"spacing-0"}
      header={
        <OakSpan $textAlign="left" $color="text-primary">
          Take a look at the carefully sequenced units which build knowledge
          progressively through the curriculum. See how key
          {contentVisible ? "" : "..."}
        </OakSpan>
      }
    >
      <OakFlex
        $gap="spacing-16"
        ref={accordionContentRef}
        $flexDirection="column"
        $overflow="hidden"
        $color="text-primary"
      >
        <OakSpan>
          concepts develop through our use of threads, which add vertical
          coherence.
        </OakSpan>
        <OakSpan>
          {" "}
          Explore free teaching resources for {keystageTitle.toLowerCase()},{" "}
          {formatSubjectName(subject)}, covering {years}. Save hours planning
          lessons with a slide deck, worksheet, prior knowledge starter and
          assessment exit quizzes and key vocabulary – all ready for you to
          teach and adapt for your pupils. You can download lesson and teaching
          resources, or log in and download units or save units to ‘my library’
          – whichever is best for you to plan your {formatSubjectName(subject)}{" "}
          lesson. {finalLine}
        </OakSpan>
      </OakFlex>
    </OakBasicAccordion>
  );
};

const keyStageYearsMap = {
  ks1: "years 1 and 2",
  ks2: "years 3, 4, 5 and 6",
  ks3: "years 7, 8 and 9",
  ks4: "years 10 and 11",
};
