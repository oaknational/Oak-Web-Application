import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
} from "@oaknational/oak-components";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
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
          <OakSpan $mb="space-between-s" $color={"grey60"} $font={"heading-7"}>
            {title}
          </OakSpan>
          <OakFlex $flexDirection={["column", "row", "row"]}>
            <OakFlex
              $gap={["all-spacing-4", "all-spacing-0"]}
              $maxWidth="all-spacing-11"
              $mr={"space-between-s"}
            >
              <SubjectIconBrushBorders
                $pa={4}
                containerMinWidth={[40, 60]}
                subjectSlug={subjectSlug}
                $ma={"auto"}
                isLegacyLesson={true}
                color={subjectIconBackgroundColor}
              />
            </OakFlex>
            <OakFlex $flexDirection={"column"}>
              <OakHeading tag={"h1"} $font={["heading-4", "heading-3"]}>
                {subjectTitle}
              </OakHeading>
            </OakFlex>
          </OakFlex>
          <OakP $mb="space-between-s" $mt="space-between-s" $font={"body-1"}>
            {description}
          </OakP>
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
