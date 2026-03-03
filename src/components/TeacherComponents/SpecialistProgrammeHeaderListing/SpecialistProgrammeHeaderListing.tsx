import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakUiRoleToken,
} from "@oaknational/oak-components";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";

/**
 * This is a header for the specialist listing pages (programme).
 *
 */

export type SpecialistHeaderListingProps = {
  breadcrumbs: Breadcrumb[];
  background?: OakUiRoleToken;
  subjectTitle: string;
  subjectSlug: string;
  subjectIconBackgroundColor?: OakUiRoleToken;
  title: string;
  hasCurriculumDownload?: boolean;
  description: string;
};

const SpecialistHeaderListing: FC<SpecialistHeaderListingProps> = (props) => {
  const {
    subjectSlug,
    title,
    subjectTitle,
    subjectIconBackgroundColor = "bg-decorative2-main",
    breadcrumbs,
    background = "bg-decorative2-subdued",
    description,
  } = props;

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <OakGrid>
        <OakGridArea $colSpan={[12, 6]}>
          <OakFlex $flexDirection={["column", "column", "row"]}>
            <OakFlex
              $mr={["spacing-16", "spacing-48"]}
              $maxWidth={["spacing-80", "spacing-80", "spacing-120"]}
              $alignItems={"flex-start"}
              $mb={["spacing-24", "spacing-32", "spacing-0"]}
            >
              <SubjectIconBrushBorders
                subjectSlug={subjectSlug}
                isNew={false}
                color={subjectIconBackgroundColor}
              />
            </OakFlex>
            <OakFlex $flexDirection={"column"}>
              <OakSpan
                $mb="spacing-16"
                $color={"text-subdued"}
                $font={"heading-7"}
              >
                {title}
              </OakSpan>
              <OakHeading tag={"h1"} $font={["heading-4", "heading-3"]}>
                {subjectTitle}
              </OakHeading>
              <OakP $mb="spacing-16" $mt="spacing-16" $font={"body-1"}>
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
