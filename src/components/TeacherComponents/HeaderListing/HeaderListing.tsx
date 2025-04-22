import { FC } from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "../UnitDownloadButton/UnitDownloadButton";

import {
  OakFlex,
  OakHeading,
  OakSpan,
  OakColorFilterToken,
  OakBox,
  OakInlineBanner,
  OakP,
  OakSecondaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";
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
  isIncompleteUnit?: boolean;
  subjectDescriptionUnitListingData?: UnitListingData;
  isUnitSaved?: boolean;
  onSave?: () => void;
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
    isIncompleteUnit,
    subjectDescriptionUnitListingData,
    isUnitSaved,
    onSave,
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
    showIncompleteMessage,
    setShowIncompleteMessage,
  } = useUnitDownloadButtonState();

  const isSaveEnabled = useFeatureFlagEnabled("teacher-save-units");

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
        ) : showDownloadMessage || showIncompleteMessage ? (
          <>
            <OakInlineBanner
              isOpen={showDownloadMessage}
              canDismiss
              onDismiss={() => setShowDownloadMessage(false)}
              type="neutral"
              message={
                <OakP>
                  Downloads may take a few minutes on slower Wi-Fi connections.
                </OakP>
              }
              $mb={"space-between-s"}
              $width="max-content"
            />
            {isIncompleteUnit && (
              <OakInlineBanner
                canDismiss
                onDismiss={() => setShowIncompleteMessage(false)}
                isOpen={showIncompleteMessage}
                type="neutral"
                message={<OakP>This unit is incomplete</OakP>}
                $mb={"space-between-s"}
                $width="max-content"
              />
            )}
          </>
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
                $height="max-content"
                $flexWrap="wrap"
              >
                {unitDownloadFileId && onUnitDownloadSuccess && (
                  <UnitDownloadButton
                    setDownloadError={setDownloadError}
                    setDownloadInProgress={setDownloadInProgress}
                    setShowDownloadMessage={setShowDownloadMessage}
                    setShowIncompleteMessage={setShowIncompleteMessage}
                    downloadInProgress={downloadInProgress}
                    unitFileId={unitDownloadFileId}
                    onDownloadSuccess={onUnitDownloadSuccess}
                    showNewTag={!isSaveEnabled}
                  />
                )}
                {shareButton}
                {isSaveEnabled && onSave && (
                  <OakSecondaryButton
                    iconName={
                      isUnitSaved ? "bookmark-filled" : "bookmark-outlined"
                    }
                    isTrailingIcon
                    onClick={onSave}
                    ph={["inner-padding-xs", "inner-padding-m"]}
                    pv={["inner-padding-ssx", "inner-padding-ssx"]}
                  >
                    <OakFlex $alignItems="center" $gap={"space-between-xs"}>
                      <OakTagFunctional
                        label="New"
                        $background="mint"
                        $color="text-primary"
                        $font="heading-light-7"
                        $pv={"inner-padding-none"}
                        $display={["none", "inline"]}
                      />
                      Save
                    </OakFlex>
                  </OakSecondaryButton>
                )}
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
