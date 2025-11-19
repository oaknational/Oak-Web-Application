import { FC } from "react";
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
  OakColorToken,
} from "@oaknational/oak-components";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "../UnitDownloadButton/UnitDownloadButton";

import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { LessonHeaderWrapper } from "@/components/TeacherComponents/LessonHeaderWrapper";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import RiskAssessmentBanner from "@/components/TeacherComponents/RiskAssessmentBanner";
import HeaderListingCurriculumDownloadButton from "@/components/TeacherComponents/HeaderListingCurriculumDownloadButton";
import ComplexCopyrightRestrictionBanner from "@/components/TeacherComponents/ComplexCopyrightRestrictionBanner/ComplexCopyrightRestrictionBanner";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import TeacherSubjectDescription from "@/components/TeacherComponents/TeacherSubjectDescription/TeacherSubjectDescription";

/**
 * This is a header for the listing pages (lesson, unit and programme).
 *
 */

export type HeaderListingProps = {
  breadcrumbs: Breadcrumb[];
  background: OakColorToken;
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
  isUnitSaving?: boolean;
  onSave?: () => void;
  isGeorestrictedUnit?: boolean;
  isLoginRequiredUnit?: boolean;
  unitTitle?: string;
  unitSlug?: string;
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
    isUnitSaving,
    onSave,
    isGeorestrictedUnit,
    isLoginRequiredUnit,
    unitTitle,
    unitSlug,
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
              $mb={"spacing-16"}
              $width="max-content"
            />
            {isIncompleteUnit && (
              <OakInlineBanner
                canDismiss
                onDismiss={() => setShowIncompleteMessage(false)}
                isOpen={showIncompleteMessage}
                type="neutral"
                message={<OakP>This unit is incomplete</OakP>}
                $mb={"spacing-16"}
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
      <OakFlex $mb={["spacing-12", "spacing-0"]} $flexDirection={"column"}>
        <OakFlex $mb={["spacing-24", "spacing-0"]}>
          <OakFlex
            $mr={["spacing-16", "spacing-32"]}
            $height={["spacing-80", "spacing-160"]}
          >
            <SubjectIconBrushBorders
              subjectSlug={subjectSlug}
              isNew={isNew}
              color={subjectIconBackgroundColor}
            />
          </OakFlex>
          <OakFlex $flexDirection={"column"}>
            <OakSpan
              $mb="spacing-8"
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
              $mb={"spacing-24"}
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
            <OakFlex $flexDirection="column" $gap="spacing-16">
              <OakFlex $gap="spacing-16" $height="max-content" $flexWrap="wrap">
                {unitDownloadFileId && onUnitDownloadSuccess && (
                  <UnitDownloadButton
                    setDownloadError={setDownloadError}
                    setDownloadInProgress={setDownloadInProgress}
                    setShowDownloadMessage={setShowDownloadMessage}
                    setShowIncompleteMessage={setShowIncompleteMessage}
                    downloadInProgress={downloadInProgress}
                    unitFileId={unitDownloadFileId}
                    onDownloadSuccess={onUnitDownloadSuccess}
                    showNewTag={false}
                    geoRestricted={Boolean(isGeorestrictedUnit)}
                  />
                )}
                {shareButton}
                {onSave && (
                  <OakSecondaryButton
                    iconName={
                      isUnitSaved ? "bookmark-filled" : "bookmark-outlined"
                    }
                    isTrailingIcon
                    onClick={onSave}
                    ph={["spacing-8", "spacing-16"]}
                    pv={["spacing-4", "spacing-4"]}
                    $mb={["spacing-0", "spacing-16", "spacing-0"]}
                    data-testid="save-unit-button"
                    disabled={isUnitSaving}
                  >
                    <OakFlex $alignItems="center" $gap={"spacing-12"}>
                      <OakTagFunctional
                        label="New"
                        $background="mint"
                        $color="text-primary"
                        $font="heading-light-7"
                        $pv={"spacing-0"}
                        $display={["none", "inline"]}
                      />
                      {isUnitSaved ? "Saved" : "Save"}
                    </OakFlex>
                  </OakSecondaryButton>
                )}
              </OakFlex>
              <OakBox $display={["none", "block", "block"]}>
                {bannersBlock}
              </OakBox>
              <ComplexCopyrightRestrictionBanner
                isGeorestricted={isGeorestrictedUnit}
                isLoginRequired={isLoginRequiredUnit}
                componentType="lesson_listing"
                unitName={unitTitle}
                unitSlug={unitSlug}
              />
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
      <OakFlex $background={background} $display={["inline", "none"]}>
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
      </OakFlex>
    </LessonHeaderWrapper>
  );
};

export default HeaderListing;
