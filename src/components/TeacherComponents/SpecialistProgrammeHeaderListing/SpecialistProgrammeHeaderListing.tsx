import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakColorFilterToken,
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
  subjectIconBackgroundColor?: OakColorFilterToken;
  title: string;
  hasCurriculumDownload?: boolean;
  description: string;
};

const SpecialistHeaderListing: FC<SpecialistHeaderListingProps> = (props) => {
  const {
    subjectSlug,
    title,
    subjectTitle,
    subjectIconBackgroundColor = "aqua",
    breadcrumbs,
    background = "aqua50",
    description,
  } = props;

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <OakGrid>
        <OakGridArea $colSpan={[12, 6]}>
          <OakFlex $flexDirection={["column", "column", "row"]}>
            <OakFlex
              $mr={["space-between-s", "space-between-l"]}
              $maxWidth={["all-spacing-13", "all-spacing-13", "all-spacing-16"]}
              $alignItems={"flex-start"}
              $mb={[
                "space-between-m",
                "space-between-m2",
                "space-between-none",
              ]}
            >
              <SubjectIconBrushBorders
                subjectSlug={subjectSlug}
                isNew={false}
                color={subjectIconBackgroundColor}
              />
            </OakFlex>
            <OakFlex $flexDirection={"column"}>
              <OakSpan
                $mb="space-between-s"
                $color={"grey60"}
                $font={"heading-7"}
              >
                {title}
              </OakSpan>
              <OakHeading tag={"h1"} $font={["heading-4", "heading-3"]}>
                {subjectTitle}
              </OakHeading>
              <OakP
                $mb="space-between-s"
                $mt="space-between-s"
                $font={"body-1"}
              >
                {description}
              </OakP>
            </OakFlex>
          </OakFlex>

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
