import React, { FC } from "react";
import { useRouter } from "next/router";
import { OakHeading, OakP, OakFlex } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import { Hr } from "@/components/SharedComponents/Typography";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon/SubjectIcon";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/SharedComponents/TabularNav";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { OakColorName } from "@/styles/theme/types";
import {
  CurriculumSelectionSlugs,
  CurriculumTab,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import { isCycleTwoEnabled } from "@/utils/curriculum/features";

export type CurriculumHeaderPageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  keyStages: string[];
  color1?: OakColorName;
  color2?: OakColorName;
};

const CurriculumHeader: FC<CurriculumHeaderPageProps> = ({
  color1 = "aqua",
  color2 = "aqua30",
  curriculumSelectionSlugs,
  subjectPhaseOptions,
  keyStages,
}) => {
  const cycleTwoEnabled = isCycleTwoEnabled();
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
      currentStyles: ["underline"],
      scroll: false,
    },
    {
      label: "Overview",
      page: "curriculum-overview",
      subjectPhaseSlug: subjectPhaseSlug,
      isCurrent: tab === "overview",
      currentStyles: ["underline"],
      scroll: false,
    },
    {
      label: "Download",
      page: "curriculum-downloads",
      subjectPhaseSlug: subjectPhaseSlug,
      isCurrent: tab === "downloads",
      currentStyles: ["underline"],
      scroll: false,
    },
  ];

  return (
    <Box $mb={40}>
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
      <Box $background={cycleTwoEnabled ? color1 : color2}>
        {/* @todo replace with OakFlex - work out padding as max padding in oak-components is 24px */}
        <Flex $pv={32}>
          <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
            <OakFlex>
              <Box
                $background={cycleTwoEnabled ? color2 : color1}
                $borderRadius={6}
                $minWidth={56}
                $mr={12}
                $mv={"auto"}
              >
                <SubjectIcon
                  subjectSlug={subject.slug}
                  $color="white"
                  $borderColor="white"
                  $width={80}
                  data-testid="subjectIcon"
                />
              </Box>
              <OakFlex $justifyContent={"center"} $flexDirection={"column"}>
                {phase.slug === "secondary" && (
                  <OakP
                    $font={"heading-light-7"}
                    data-testid={"examboard-metadata"}
                  >
                    {`${ks4Option ? ks4Option.title : "All exam boards"} (KS4)`}
                  </OakP>
                )}
                <OakHeading
                  tag={"h1"}
                  $font={["heading-4", "heading-3"]}
                  data-testid="curriculum-heading"
                >
                  {pageTitle}
                </OakHeading>
              </OakFlex>
            </OakFlex>
          </Box>
        </Flex>
        <TabularNav
          $maxWidth={1280}
          $mh={"auto"}
          $ph={18}
          label="Curriculum Selection"
          links={links}
          data-testid="tabularNav"
        />
      </Box>
    </Box>
  );
};
export default CurriculumHeader;
