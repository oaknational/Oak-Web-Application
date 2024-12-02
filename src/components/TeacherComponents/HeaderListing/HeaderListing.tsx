import { FC } from "react";
import { OakFlex, OakHeading, OakSpan } from "@oaknational/oak-components";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import HeaderListingCurriculumDownloadButton from "@/components/TeacherComponents/HeaderListingCurriculumDownloadButton";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { OakColorName } from "@/styles/theme";

/**
 * This is a header for the listing pages (lesson, unit and programme).
 *
 */

export type HeaderListingProps = {
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
  subjectTitle: string;
  subjectSlug: string;
  subjectIconBackgroundColor: OakColorName;
  year?: string;
  keyStageSlug?: string;
  keyStageTitle?: string;
  tierSlug?: string | null;
  examBoardTitle?: string | null;
  tierTitle?: string | null;
  yearTitle?: string | null;
  lessonDescription?: string;
  isNew: boolean;
  title: string;
  programmeFactor: string;
  hasCurriculumDownload?: boolean;
  shareButton?: React.ReactNode;
  unitDownloadButton?: React.ReactNode;
  banner?: React.ReactNode;
};

const HeaderListing: FC<HeaderListingProps> = (props) => {
  const {
    subjectSlug,
    title,
    keyStageSlug,
    keyStageTitle,
    isNew,
    programmeFactor,
    subjectIconBackgroundColor,
    breadcrumbs,
    background,
    hasCurriculumDownload = true,
    examBoardTitle,
    tierTitle,
    yearTitle,
    shareButton,
    unitDownloadButton,
    banner,
  } = props;

  const isKeyStagesAvailable = keyStageSlug && keyStageTitle;
  const specialistDownloadLink = `/teachers/curriculum/previous-downloads#Specialist`;

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <OakFlex
        $mb={["space-between-xs", "space-between-none"]}
        $flexDirection={"column"}
      >
        <OakFlex>
          <OakFlex
            $mr={["space-between-s", "space-between-m2"]}
            $height={["all-spacing-13", "all-spacing-17"]}
          >
            <SubjectIconBrushBorders
              subjectSlug={subjectSlug}
              isNew={isNew}
              color={subjectIconBackgroundColor}
            />
          </OakFlex>
          <OakFlex $flexDirection={"column"}>
            <OakSpan
              $mb="space-between-ssx"
              $color={"grey60"}
              $font={"heading-light-7"}
            >
              {yearTitle ? (
                <LessonMetadata
                  examBoardTitle={examBoardTitle}
                  yearTitle={yearTitle}
                  tierTitle={tierTitle}
                />
              ) : (
                programmeFactor
              )}
            </OakSpan>
            <OakHeading
              $mb={"space-between-m"}
              tag={"h1"}
              $font={["heading-5", "heading-3"]}
            >
              {title}
            </OakHeading>
            <OakFlex $flexDirection="column" $gap="space-between-s">
              <OakFlex
                $gap="space-between-s"
                $flexDirection={["column", "row"]}
              >
                {unitDownloadButton}
                {shareButton}
              </OakFlex>
              {banner}
            </OakFlex>
          </OakFlex>
        </OakFlex>
      </OakFlex>
      <Flex $background={background} $display={["inline", "none"]}>
        {hasCurriculumDownload && isKeyStagesAvailable && (
          <HeaderListingCurriculumDownloadButton
            keyStageSlug={keyStageSlug}
            subjectSlug={subjectSlug}
          />
        )}
        {hasCurriculumDownload && !isKeyStagesAvailable && (
          <ButtonAsLink
            icon={"download"}
            iconBackground="black"
            label={"Curriculum download"}
            href={specialistDownloadLink}
            page={null}
            size="large"
            variant="minimal"
            $iconPosition={"trailing"}
            data-testid="curriculum-downloads-link"
          />
        )}
      </Flex>
    </LessonHeaderWrapper>
  );
};

export default HeaderListing;
