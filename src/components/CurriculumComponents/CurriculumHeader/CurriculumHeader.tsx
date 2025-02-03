import React, { FC } from "react";
import { useRouter } from "next/router";
import {
  OakHeading,
  OakP,
  OakFlex,
  OakHandDrawnCardWithIcon,
} from "@oaknational/oak-components";

import CurriculumHeaderTabNav from "../CurriculumHeaderTabNav";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import { Hr } from "@/components/SharedComponents/Typography";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { OakColorName } from "@/styles/theme/types";
import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumTab } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type CurriculumHeaderPageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  keyStages: string[];
  color1?: OakColorName;
  color2?: OakColorName;
};

const CurriculumHeader: FC<CurriculumHeaderPageProps> = ({
  color1,
  color2,
  curriculumSelectionSlugs,
  subjectPhaseOptions,
  keyStages,
}) => {
  const router = useRouter();
  const tab = router.query.tab as CurriculumTab;
  const subject = subjectPhaseOptions.subjects.find(
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

  let pageTitle: string = "";
  const keyStageStrings: string[] = [];
  if (keyStages.includes("ks1")) keyStageStrings.push("KS1");
  if (keyStages.includes("ks2")) keyStageStrings.push("KS2");
  if (keyStages.includes("ks3")) keyStageStrings.push("KS3");
  if (keyStages.includes("ks4")) keyStageStrings.push("KS4");
  const keyStageString = keyStageStrings.join(" & ");
  if (["primary", "secondary"].includes(phase.slug)) {
    pageTitle = `${keyStageString} ${subject.title}`;
  }

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
    <Box $mb={48}>
      {/* @todo replace with OakFlex - colours type needs updating to oak-components colour token */}
      <Flex $background={color1} $pv={[20]}>
        <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
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
          <Hr $color={"white"} />
          <SubjectPhasePicker
            {...subjectPhaseOptions}
            currentSelection={currentSelection}
          />
        </Box>
      </Flex>
      <Box $background={color2}>
        {/* @todo replace with OakFlex - work out padding as max padding in oak-components is 24px */}
        <Flex $pb={[24, 24]} $pt={[20, 30]}>
          <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
            <OakFlex>
              <Box $minWidth={80} $mr={[12, 26]} $mv={"auto"}>
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
              </Box>

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
          </Box>
        </Flex>
        <Flex $borderColor="mint30" $bt={2}>
          <Box $maxWidth={1280} $ph={[0, 20]} $mh={"auto"} $width={"100%"}>
            <CurriculumHeaderTabNav
              data-testid="tabularNav"
              label="Curriculum Selection"
              links={links}
              variant="flat"
              $alignItems={"center"}
              $height={[60, 64]}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
export default CurriculumHeader;
