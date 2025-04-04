import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakSpan,
  OakColorFilterToken,
  OakBox,
  OakInlineBanner,
} from "@oaknational/oak-components";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "../UnitDownloadButton/UnitDownloadButton";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import RiskAssessmentBanner from "@/components/TeacherComponents/RiskAssessmentBanner";
import HeaderListingCurriculumDownloadButton from "@/components/TeacherComponents/HeaderListingCurriculumDownloadButton";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { OakColorName } from "@/styles/theme";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import TeacherSubjectDescription from "@/components/TeacherComponents/TeacherSubjectDescription/TeacherSubjectDescription";

/**
 * This is a header for the listing pages (lesson, unit and programme).
 *
 */

export type HeaderListingProps = {
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
  subjectTitle: string;
  subjectSlug: string;
  subjectIconBackgroundColor: OakColorFilterToken;
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
  unitDownloadFileId?: string;
  onUnitDownloadSuccess?: () => void;
  showRiskAssessmentBanner?: boolean;
  subjectDescriptionUnitListingData?: UnitListingData;
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
    unitDownloadFileId,
    onUnitDownloadSuccess,
    showRiskAssessmentBanner,
    subjectDescriptionUnitListingData,
  } = props;

  const isKeyStagesAvailable = keyStageSlug && keyStageTitle;
  const specialistDownloadLink = `/teachers/curriculum/previous-downloads#Specialist`;

  const {
    showDownloadMessage,
    setShowDownloadMessage,
    downloadError,
    setDownloadError,
    setDownloadInProgress,
    downloadInProgress,
  } = useUnitDownloadButtonState();

  const bannersBlock = (
    <>
      <OakBox aria-live="polite">
        {downloadError ? (
          <OakInlineBanner
            isOpen
            type="error"
            message="Sorry, download is not working. Please try again in a few minutes."
            icon="error"
          />
        ) : showDownloadMessage ? (
          <OakInlineBanner
            isOpen={showDownloadMessage}
            canDismiss
            onDismiss={() => setShowDownloadMessage(false)}
            type="neutral"
            message="Downloads may take a few minutes on slower Wi-Fi connections."
            $mb={"space-between-s"}
          />
        ) : null}
      </OakBox>
      {showRiskAssessmentBanner && <RiskAssessmentBanner />}
    </>
  );

  return (
    <LessonHeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <OakFlex
        $mb={["space-between-xs", "space-between-none"]}
        $flexDirection={"column"}
      >
        <OakFlex $mb={["space-between-m", "space-between-none"]}>
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
            {subjectDescriptionUnitListingData && (
              <OakBox $display={["none", "inline"]}>
                <TeacherSubjectDescription
                  unitListingData={subjectDescriptionUnitListingData}
                />
              </OakBox>
            )}
            <OakFlex $flexDirection="column" $gap="space-between-s">
              <OakFlex
                $gap="space-between-s"
                $flexDirection={["column", "row"]}
              >
                {unitDownloadFileId && onUnitDownloadSuccess && (
                  <UnitDownloadButton
                    setDownloadError={setDownloadError}
                    setDownloadInProgress={setDownloadInProgress}
                    setShowDownloadMessage={setShowDownloadMessage}
                    downloadInProgress={downloadInProgress}
                    unitFileId={unitDownloadFileId}
                    onDownloadSuccess={onUnitDownloadSuccess}
                  />
                )}
                {shareButton}
              </OakFlex>
              <OakBox $display={["none", "block", "block"]}>
                {bannersBlock}
              </OakBox>
            </OakFlex>
          </OakFlex>
        </OakFlex>
        {subjectDescriptionUnitListingData && (
          <OakBox $display={["inline", "none"]}>
            <TeacherSubjectDescription
              unitListingData={subjectDescriptionUnitListingData}
            />
          </OakBox>
        )}
        <OakBox $display={["block", "none", "none"]}>{bannersBlock}</OakBox>
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
