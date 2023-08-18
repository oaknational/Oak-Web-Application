import React, { FC } from "react";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import { Heading, Hr } from "@/components/Typography";
import SubjectIcon from "@/components/SubjectIcon/SubjectIcon";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/TabularNav/TabularNav";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import { CurriculumHeaderData } from "@/node-lib/curriculum-api-2023";

export type CurriculumHeaderPageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
  data: CurriculumHeaderData;
  pageSlug: string;
  tab: string;
};

const CurriculumHeader: FC<CurriculumHeaderPageProps> = ({
  subjectPhaseOptions,
  pageSlug,
  tab,
  data,
}) => {
  const { subject, phase, examBoard } = data;
  const examBoardTitle = examBoard.title ? ` ${examBoard.title}` : "";
  const pageTitle = ` ${phase.title} ${subject.title}${examBoardTitle}`;
  return (
    <Box>
      <Flex $background={"aqua"} $justifyContent={"center"} $pv={[20]}>
        <Box $width={"80%"}>
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: {
                  page: null,
                  href: "/beta/teachers/",
                },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: null,
                  href: "/beta/teachers/curriculum",
                },
                label: "Curriculum resource",
              },
              {
                oakLinkProps: {
                  page: null,
                  href: "",
                },
                label: pageTitle,
                disabled: true,
              },
            ]}
          />
          <Hr $color={"white"} />
          <SubjectPhasePicker {...subjectPhaseOptions} />
        </Box>
      </Flex>
      <Box $background={"aqua50"}>
        <Flex $justifyContent={"center"} $pv={32}>
          <Box $width={"80%"}>
            <Flex $alignItems={"center"} $justifyContent={"left"}>
              <Box $background={"aqua"} $borderRadius={6} $mr={12}>
                <SubjectIcon
                  subjectSlug={subject.slug}
                  $maxHeight={56}
                  $maxWidth={56}
                  $color="white"
                  $borderColor="white"
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
              href: `/beta/teachers/curriculum/${pageSlug}/overview`,
              label: "Overview",
              page: null,
              scroll: false,
              isCurrent: tab === "overview",
              currentStyles: ["underline"],
            },
            {
              href: `/beta/teachers/curriculum/${pageSlug}/units`,
              label: "Unit sequence",
              page: null,
              scroll: false,
              isCurrent: tab === "units",
              currentStyles: ["underline"],
            },
            {
              href: `/beta/teachers/curriculum/${pageSlug}/downloads`,
              label: "Downloads",
              page: null,
              scroll: false,
              isCurrent: tab === "downloads",
              currentStyles: ["underline"],
            },
          ]}
        />
      </Box>
    </Box>
  );
};
export default CurriculumHeader;
