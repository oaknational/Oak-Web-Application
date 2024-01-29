import { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import { Heading, P, Span } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import { OakColorName } from "@/styles/theme";

/**
 * This is a header for the specialist listing pages (programme).
 *
 */

export type SpecialistHeaderListingProps = {
  breadcrumbs: Breadcrumb[];
  background?: OakColorName;
  subjectTitle: string;
  subjectSlug: string;
  subjectIconBackgroundColor?: OakColorName;
  title: string;
  hasCurriculumDownload?: boolean;
  description: string;
};

const SpecialistHeaderListing: FC<SpecialistHeaderListingProps> = (props) => {
  const {
    subjectSlug,
    title,
    subjectTitle,
    subjectIconBackgroundColor = "white",
    breadcrumbs,
    background = "aqua",
    description,
  } = props;

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <OakGrid>
        <OakGridArea $colSpan={[12, 6]}>
          <Span $mb={16} $color={"grey60"} $font={"heading-7"}>
            {title}
          </Span>
          <Flex $flexDirection={["column", "row", "row"]}>
            <Flex $gap={[16, 0]} $maxWidth={60} $mr={16}>
              <SubjectIconBrushBorders
                $pa={4}
                containerMinWidth={[40, 60]}
                subjectSlug={subjectSlug}
                $ma={"auto"}
                isLegacyLesson={true}
                color={subjectIconBackgroundColor}
              />
            </Flex>
            <Flex $flexDirection={"column"}>
              <Heading tag={"h1"} $font={["heading-4", "heading-3"]}>
                {subjectTitle}
              </Heading>
            </Flex>
          </Flex>
          <P $mb={16} $mt={16} $font={"body-1"}>
            {description}
          </P>
          {/* Commented out until - I want to be able to download specialist curriculum maps LESQ-586 */}
          {/* {hasCurriculumDownload && (
            <HeaderListingCurriculumDownloadButton
              keyStageSlug={"slug"}
              keyStageTitle={"title"}
              subjectSlug={subjectSlug}
              subjectTitle={subjectTitle}
            />
          )} */}
        </OakGridArea>
      </OakGrid>
    </LessonHeaderWrapper>
  );
};

export default SpecialistHeaderListing;
