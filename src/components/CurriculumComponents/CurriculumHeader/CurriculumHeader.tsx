import React, { FC } from "react";
import { useRouter } from "next/router";
import {
  OakHeading,
  OakP,
  OakFlex,
  OakHandDrawnCardWithIcon,
  OakHandDrawnHR,
  OakBox,
  OakColorToken,
} from "@oaknational/oak-components";

import CurriculumHeaderTabNav from "../CurriculumHeaderTabNav";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumTab } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { buildPageTitle } from "@/utils/curriculum/formatting";
import { PhaseValueType } from "@/browser-lib/avo/Avo";

export type CurriculumHeaderPageProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  keyStages: string[];
  color1?: OakColorToken;
  color2?: OakColorToken;
};

const CurriculumHeader: FC<CurriculumHeaderPageProps> = ({
  color1,
  color2,
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  keyStages,
}) => {
  const router = useRouter();
  const tab = router.query.tab as CurriculumTab;
  const subject = curriculumPhaseOptions.subjects.find(
    (subject) => subject.slug === curriculumSelectionSlugs.subjectSlug,
  ) as SubjectPhasePickerData["subjects"][number] | undefined;
  const phase = subject?.phases.find(
    (phase) => phase.slug === curriculumSelectionSlugs.phaseSlug,
  );
  const ks4Option =
    subject?.ks4_options?.find(
      (option) => option.slug === curriculumSelectionSlugs.ks4OptionSlug,
    ) ?? null;

  if (!subject || !phase) {
    throw new Error("Subject or phase not found");
  }

  const currentSelection = {
    subject: subject,
    phase: phase,
    ks4Option: ks4Option,
  };

  const subjectPhaseSlug = `${subject.slug}-${phase.slug}${
    ks4Option ? `-${ks4Option.slug}` : ""
  }`;

  const pageTitle = buildPageTitle(keyStages, subject, phase);

  const links: ButtonAsLinkProps[] = [
    {
      label: "Unit sequence",
      page: "curriculum-units",
      subjectPhaseSlug: subjectPhaseSlug,
      isCurrent: tab === "units",
      scroll: false,
    },
    {
      label: "Explainer",
      page: "curriculum-overview",
      subjectPhaseSlug: subjectPhaseSlug,
      isCurrent: tab === "overview",
      scroll: false,
    },
    {
      label: "Download",
      page: "curriculum-downloads",
      subjectPhaseSlug: subjectPhaseSlug,
      isCurrent: tab === "downloads",
      scroll: false,
    },
  ];

  return (
    <OakBox $mb={["space-between-none", "space-between-l", "space-between-l"]}>
      {/* @todo replace with OakFlex - colours type needs updating to oak-components colour token */}
      <OakFlex $background={color1} $pv="inner-padding-l">
        <OakBox
          $maxWidth="all-spacing-24"
          $mh={"auto"}
          $ph="inner-padding-l"
          $width={"100%"}
        >
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: {
                  page: "home",
                },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "curriculum-landing-page",
                },
                label: "Curriculum resources",
              },
              {
                oakLinkProps: {
                  page: "curriculum-overview",
                  subjectPhaseSlug: subjectPhaseSlug,
                },
                label: pageTitle,
                disabled: true,
              },
            ]}
          />

          <OakHandDrawnHR
            hrColor={"white"}
            $height={"all-spacing-05"}
            $mv={"space-between-m2"}
          />
          <SubjectPhasePicker
            {...curriculumPhaseOptions}
            currentSelection={currentSelection}
          />
        </OakBox>
      </OakFlex>
      <OakBox $background={color2}>
        {/* @todo replace with OakFlex - work out padding as max padding in oak-components is 24px */}
        <Flex $pb={[24, 24]} $pt={[20, 30]}>
          <OakBox
            $maxWidth="all-spacing-24"
            $mh={"auto"}
            $ph="inner-padding-l"
            $width={"100%"}
          >
            <OakFlex>
              <OakBox
                $minWidth="all-spacing-13"
                $mr={["space-between-xs", "space-between-m"]}
                $mv={"auto"}
              >
                <OakHandDrawnCardWithIcon
                  iconName={getValidSubjectIconName(subject.slug)}
                  fill={"mint50"}
                  iconWidth={["all-spacing-13", "all-spacing-11"]}
                  iconHeight={["all-spacing-13", "all-spacing-11"]}
                  $width="all-spacing-13"
                  $height="all-spacing-13"
                  data-testid="subjectIcon"
                  alt=""
                />
              </OakBox>

              <OakFlex
                $rowGap={["all-spacing-2", "all-spacing-2"]}
                $justifyContent={"center"}
                $flexDirection={"column"}
              >
                {keyStages.includes("ks4") && (
                  <OakP
                    $font={"heading-light-7"}
                    data-testid={"examboard-metadata"}
                  >
                    {`${ks4Option ? ks4Option.title : "All exam boards"} (KS4)`}
                  </OakP>
                )}
                <OakHeading
                  tag={"h1"}
                  $font={["heading-5", "heading-3"]}
                  data-testid="curriculum-heading"
                >
                  {pageTitle}
                </OakHeading>
              </OakFlex>
            </OakFlex>
          </OakBox>
        </Flex>
        <Flex $borderColor="mint30" $background={"mint"} $bt={2}>
          <OakBox
            $maxWidth="all-spacing-24"
            $ph={["inner-padding-none", "inner-padding-l"]}
            $mh={"auto"}
            $width={"100%"}
          >
            <CurriculumHeaderTabNav
              data-testid="tabularNav"
              label="Curriculum Selection"
              links={links}
              variant="flat"
              $alignItems={"center"}
              $height={[60, 64]}
              trackingData={{
                subjectSlug: currentSelection.subject.slug,
                subjectTitle: currentSelection.subject.title,
                phaseSlug: currentSelection.phase.slug as PhaseValueType,
              }}
              $background={"mint"}
            />
          </OakBox>
        </Flex>
      </OakBox>
    </OakBox>
  );
};
export default CurriculumHeader;
