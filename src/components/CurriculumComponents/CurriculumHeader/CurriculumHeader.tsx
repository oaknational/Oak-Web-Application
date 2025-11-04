import React, { FC } from "react";
import styled from "styled-components";
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

import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { buildPageTitle } from "@/utils/curriculum/formatting";
import { PhaseValueType } from "@/browser-lib/avo/Avo";

const StyledOakHeading = styled(OakHeading)`
  margin-left: -0.1rem;
`;

const StyledOakP = styled(OakP)`
  line-height: 1;
`;

export type CurriculumHeaderPageProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  keyStages: string[];
  color1?: OakColorToken;
  color2?: OakColorToken;
  tab: "overview" | "units" | "downloads";
};

const CurriculumHeader: FC<CurriculumHeaderPageProps> = ({
  color1,
  color2,
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  keyStages,
  tab,
}) => {
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
    <OakBox>
      {/* @todo replace with OakFlex - colours type needs updating to oak-components colour token */}
      <OakFlex $background={color1} $pv="spacing-20">
        <OakBox
          $maxWidth="spacing-1280"
          $mh={"auto"}
          $ph="spacing-20"
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
            $height={"spacing-2"}
            $mv={"spacing-32"}
          />
          <SubjectPhasePicker
            {...curriculumPhaseOptions}
            currentSelection={currentSelection}
            tab={tab}
          />
        </OakBox>
      </OakFlex>
      <OakBox $background={color2}>
        <OakFlex $pb={"spacing-24"} $pt={["spacing-20", "spacing-32"]}>
          <OakBox
            $maxWidth="spacing-1280"
            $mh={"auto"}
            $ph="spacing-20"
            $width={"100%"}
          >
            <OakFlex>
              <OakBox
                $minWidth="spacing-80"
                $mr={["spacing-12", "spacing-24"]}
                $mv={"auto"}
              >
                <OakHandDrawnCardWithIcon
                  iconName={getValidSubjectIconName(subject.slug)}
                  fill={"mint50"}
                  iconWidth={["spacing-80", "spacing-64"]}
                  iconHeight={["spacing-80", "spacing-64"]}
                  $width="spacing-80"
                  $height="spacing-80"
                  data-testid="subjectIcon"
                  alt=""
                />
              </OakBox>

              <OakFlex $justifyContent={"center"} $flexDirection={"column"}>
                {keyStages.includes("ks4") && (
                  <StyledOakP
                    $font={"heading-light-7"}
                    data-testid={"examboard-metadata"}
                  >
                    {`${ks4Option ? ks4Option.title : "All exam boards"} (KS4)`}
                  </StyledOakP>
                )}
                <StyledOakHeading
                  tag={"h1"}
                  $font={["heading-5", "heading-3"]}
                  data-testid="curriculum-heading"
                >
                  {pageTitle}
                </StyledOakHeading>
              </OakFlex>
            </OakFlex>
          </OakBox>
        </OakFlex>
        <OakFlex
          $borderColor="mint30"
          $background={"mint"}
          $bt={"border-solid-m"}
        >
          <OakBox
            $maxWidth="spacing-1280"
            $ph={["spacing-0", "spacing-20"]}
            $mh={"auto"}
            $width={"100%"}
          >
            <CurriculumHeaderTabNav
              data-testid="tabularNav"
              label="Curriculum Selection"
              links={links}
              variant="flat"
              $alignItems={"center"}
              $height={"spacing-64"}
              trackingData={{
                subjectSlug: currentSelection.subject.slug,
                subjectTitle: currentSelection.subject.title,
                phaseSlug: currentSelection.phase.slug as PhaseValueType,
              }}
              $background={"mint"}
            />
          </OakBox>
        </OakFlex>
      </OakBox>
    </OakBox>
  );
};
export default CurriculumHeader;
