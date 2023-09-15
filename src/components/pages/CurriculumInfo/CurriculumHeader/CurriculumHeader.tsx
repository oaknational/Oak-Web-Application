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
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

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
  ) as SubjectPhasePickerData["subjects"][number] | undefined;
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
        <Flex $pv={32}>
          <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
            <Flex>
              <Box
                $background={color1}
                $borderRadius={6}
                $minWidth={56}
                $mr={12}
                $mv={"auto"}
              >
                <SubjectIcon
                  subjectSlug={subject.slug}
                  $color="white"
                  $borderColor="white"
                  $width={56}
                  data-testid="subjectIcon"
                />
              </Box>
              <Heading tag={"h1"} $font={"heading-4"} $mv={"auto"}>
                {pageTitle}
              </Heading>
            </Flex>
          </Box>
        </Flex>
        <TabularNav
          $maxWidth={1280}
          $mh={"auto"}
          $ph={18}
          label="Curriculum Selection"
          links={[
            {
              label: "Overview",
              page: "curriculum-overview",
              subjectPhaseSlug: subjectPhaseSlug,
              isCurrent: tab === "overview",
              currentStyles: ["underline"],
            },
            {
              label: "Unit sequence",
              page: "curriculum-units",
              subjectPhaseSlug: subjectPhaseSlug,
              isCurrent: tab === "units",
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
