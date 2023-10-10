import React, { FC } from "react";
import { useRouter } from "next/router";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import { Heading, Hr, P } from "@/components/Typography";
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

  const subjectPhaseSlug = `${subject.slug}-${phase.slug}${
    examboard ? `-${examboard.slug}` : ""
  }`;

  let pageTitle: string;
  switch (phase.slug) {
    case "primary":
      pageTitle = `KS1 & KS2 ${subject.title}`;
      break;
    case "secondary":
      pageTitle = `KS3 & KS4 ${subject.title}`;
      break;
    default:
      pageTitle = "";
      break;
  }

  return (
    <Box $mb={40}>
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
                  $width={64}
                  data-testid="subjectIcon"
                />
              </Box>
              <Box>
                {examboard?.title && (
                  <P
                    $font={"heading-light-7"}
                    data-testid={"examboard-metadata"}
                  >
                    {`${examboard.title} (KS4)`}
                  </P>
                )}
                <Heading
                  tag={"h1"}
                  $font={["heading-4", "heading-3"]}
                  data-testid="curriculum-heading"
                >
                  {pageTitle}
                </Heading>
              </Box>
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
          ]}
          data-testid="tabularNav"
        />
      </Box>
    </Box>
  );
};
export default CurriculumHeader;
