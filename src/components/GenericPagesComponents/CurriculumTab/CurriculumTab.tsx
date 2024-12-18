import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLI,
  OakUL,
  OakTypography,
  OakFlex,
  OakSecondaryLink,
} from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Illustration from "@/components/SharedComponents/Illustration";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { resolveOakHref } from "@/common-lib/urls";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

type CurriculumDownloadTabProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
};
const CurriculumTab: FC<CurriculumDownloadTabProps> = ({
  subjectPhaseOptions,
}) => {
  return (
    <OakFlex $background={"mint"} $pv="inner-padding-xl">
      <MaxWidth $ph={[16]} $pb={24}>
        <OakGrid $cg={"all-spacing-4"}>
          <OakGridArea $colSpan={[12, 6]}>
            {/* @todo replace with OakFlex - work out $flex prop */}
            <OakFlex
              $flexDirection={"column"}
              $gap={"space-between-m"}
              $pv={"inner-padding-xl3"}
            >
              <OakHeading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Teachers & subject leads
              </OakHeading>
              <OakHeading $font={"heading-3"} tag={"h2"}>
                Curriculum plans
              </OakHeading>
              <OakFlex $flexDirection={"column"}>
                {" "}
                <OakTypography $font={"body-1"}>
                  All of our curriculum plans are:
                </OakTypography>
                <OakUL $font={"body-1"}>
                  <OakLI $mt={"space-between-s"}>
                    National curriculum-aligned
                  </OakLI>
                  <OakLI $mt={"space-between-s"}>
                    Sequenced across year groups
                  </OakLI>
                  <OakLI $mt={"space-between-s"}>
                    Designed by curriculum experts
                  </OakLI>
                </OakUL>
              </OakFlex>

              <OakFlex
                $gap="all-spacing-6"
                $flexWrap={"wrap"}
                $pb="inner-padding-xl"
              >
                <OakTypography $font={"body-1-bold"}>
                  <OakSecondaryLink
                    href={resolveOakHref({ page: "curriculum-landing-page" })}
                    iconName="chevron-right"
                    isTrailingIcon
                  >
                    Our curriculum planning approach
                  </OakSecondaryLink>
                </OakTypography>
              </OakFlex>
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            {/* @todo replace with OakFlex - work out $flex prop */}
            <Flex
              $pv={64}
              $flexDirection={"column"}
              $justifyContent={"space-between"}
              $alignItems={"flex-end"}
              $flex={"0 1 auto"}
              $position={"relative"}
              $minWidth={[0, 350]}
              $display={["none", "flex"]}
              $maxWidth={524}
              $pl={20}
            >
              <OakFlex $flexDirection={"column"} $gap="all-spacing-2">
                <Illustration
                  $transform={["none", "none", "rotate(2deg)"]}
                  slug={"teacher-whiteboard"}
                  noCrop
                  $objectFit="contain"
                  priority
                  $ba={3}
                  width={600}
                  $borderStyle={"solid"}
                  $borderColor={"black"}
                />
              </OakFlex>
            </Flex>
          </OakGridArea>
        </OakGrid>
        <Box $maxWidth={["100%", 960]}>
          <SubjectPhasePicker {...subjectPhaseOptions} />
        </Box>
      </MaxWidth>
    </OakFlex>
  );
};

export default CurriculumTab;
