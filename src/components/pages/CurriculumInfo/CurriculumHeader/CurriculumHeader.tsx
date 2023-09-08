import React, { FC } from "react";
import { useRouter } from "next/router";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import { Heading, Hr } from "@/components/Typography";
import SubjectIcon from "@/components/SubjectIcon/SubjectIcon";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/TabularNav/TabularNav";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import { OakColorName } from "@/styles/theme/types";
import {
  CurriculumSelectionSlugs,
  CurriculumTab,
} from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";

export type CurriculumHeaderPageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  color1?: OakColorName;
  color2?: OakColorName;
};

const CurriculumHeader: FC<CurriculumHeaderPageProps> = ({
  color1 = "aqua",
  color2 = "aqua30",
  curriculumSelectionSlugs,
  subjectPhaseOptions,
}) => {
  const router = useRouter();
  const tab = router.query.tab as CurriculumTab;
  const subject = subjectPhaseOptions.subjects.find(
    (subject) => subject.slug === curriculumSelectionSlugs.subjectSlug,
  );
  const phase = subject?.phases.find(
    (phase) => phase.slug === curriculumSelectionSlugs.phaseSlug,
  );
  const examboard =
    subject?.examboards?.find(
      (examboard) => examboard.slug === curriculumSelectionSlugs.examboardSlug,
    ) ?? null;

  if (!subject || !phase) {
    throw new Error("Subject or phase not found");
  }

  const currentSelection = {
    subject: subject,
    phase: phase,
    examboard: examboard,
  };

  const pageTitle = `${phase.title} ${subject.title}${
    examboard ? ` ${examboard.title}` : ""
  }`;

  const subjectPhaseSlug = `${subject.slug}-${phase.slug}${
    examboard ? `-${examboard.slug}` : ""
  }`;

  return (
    <Box>
      <Flex $background={color1} $justifyContent={"center"} $pv={[20]}>
        <Box $width={"80%"}>
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: {
                  page: "home",
                  viewType: "teachers",
                },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "curriculum-landing-page",
                  viewType: "teachers",
                },
                label: "Curriculum resources",
              },
              {
                oakLinkProps: {
                  page: "curriculum-overview",
                  viewType: "teachers",
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
        <Flex $justifyContent={"center"} $pv={32}>
          <Box $width={"80%"}>
            <Flex $alignItems={"center"} $justifyContent={"left"}>
              <Box $background={color1} $borderRadius={6} $mr={12}>
                <SubjectIcon
                  subjectSlug={subject.slug}
                  $maxHeight={56}
                  $maxWidth={56}
                  $color="white"
                  $borderColor="white"
                  data-testid="subjectIcon"
                />
              </Box>

              <Heading tag={"h1"} $font={"heading-light-3"} $mr={26}>
                {pageTitle}
              </Heading>
            </Flex>
          </Box>
        </Flex>
        <TabularNav
          $width={"80%"}
          $ma={"auto"}
          label="Curriculum Selection"
          links={[
            {
              label: "Overview",
              page: "curriculum-overview",
              viewType: "teachers",
              subjectPhaseSlug: subjectPhaseSlug,
              isCurrent: tab === "overview",
              currentStyles: ["underline"],
            },
            {
              label: "Unit sequence",
              page: "curriculum-units",
              viewType: "teachers",
              subjectPhaseSlug: subjectPhaseSlug,
              isCurrent: tab === "units",
              currentStyles: ["underline"],
            },
            {
              label: "Downloads",
              page: "curriculum-downloads",
              viewType: "teachers",
              subjectPhaseSlug: subjectPhaseSlug,
              isCurrent: tab === "downloads",
              currentStyles: ["underline"],
            },
          ]}
          data-testid="tabularNav"
        />
      </Box>
    </Box>
  );
};
export default CurriculumHeader;
