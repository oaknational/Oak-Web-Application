import { FC } from "react";
import { OakHeading, OakSpan } from "@oaknational/oak-components";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import HeaderListingCurriculumDownloadButton from "@/components/TeacherComponents/HeaderListingCurriculumDownloadButton";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import { OakColorName } from "@/styles/theme";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

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
  } = props;

  const isKeyStagesAvailable = keyStageSlug && keyStageTitle;
  const specialistDownloadLink = `/teachers/curriculum/previous-downloads#Specialist`;

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <Flex $mb={[12, 0]} $flexDirection={"column"}>
        <Flex>
          <Flex $mr={[16, 32]} $height={[80, 140]} $maxWidth={[80, 140]}>
            <SubjectIconBrushBorders
              $pa={16}
              subjectSlug={subjectSlug}
              $ma={"auto"}
              isNew={isNew}
              color={subjectIconBackgroundColor}
            />
          </Flex>
          <Flex $flexDirection={"column"}>
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
            <Flex $display={["none", "flex"]}>
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
                  data-testid="curriculum-download-link"
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
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
            data-testid="curriculum-download-link"
          />
        )}
      </Flex>
    </LessonHeaderWrapper>
  );
};

export default HeaderListing;
