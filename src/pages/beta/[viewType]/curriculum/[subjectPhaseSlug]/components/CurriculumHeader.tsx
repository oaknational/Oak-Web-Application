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

export type CurriculumHeaderPageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
  subject: { name: string; slug: string };
  phase: { name: string; slug: string };
};

const CurriculumHeader: FC<CurriculumHeaderPageProps> = ({
  subjectPhaseOptions,
  subject,
  phase,
}) => {
  const subjectPhaseName = `${subject.name} ${phase.name}`;
  return (
    <Box>
      <Flex $background={"aqua"} $justifyContent={"center"} $pv={[20]}>
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
                  page: "home",
                  viewType: "teachers",
                },
                label: "Curriculum resource",
              },
              {
                oakLinkProps: {
                  page: "home",
                  viewType: "teachers",
                },
                label: subjectPhaseName,
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
                {subjectPhaseName}
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
              href: `/beta/teachers/curriculum/info/overview`, //`/beta/teachers/curriculum/info/${subjectPhase}/overview`,
              label: "Overview",
              page: null,
              scroll: false,
            },
            {
              href: "/beta/teachers/curriculum/info/sequence",
              label: "Unit sequence",
              page: null,
              scroll: false,
            },
            {
              href: "/beta/teachers/curriculum/info/downloads",
              label: "Downloads",
              page: null,
              scroll: false,
            },
          ]}
        />
      </Box>
    </Box>
  );
};
export default CurriculumHeader;
