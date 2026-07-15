"use client";
import { OakBox, OakPrimaryButton } from "@oaknational/oak-components";

import UnitHeader from "./UnitHeader/UnitHeader";
import { Breadcrumbs } from "./Breadcrumbs/Breadcrumbs";
import { UnitOverviewContent } from "./UnitOverviewContent/UnitOverviewContent";

import { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { SubjectIcon } from "@/components/TeacherComponents/Header/Header";
import { useUnitDownloadButtonState } from "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton";
import { getUnitDownloadFileId } from "@/utils/getUnitDownloadFileId";
import ComplexCopyrightRestrictionBanner from "@/components/TeacherComponents/ComplexCopyrightRestrictionBanner/ComplexCopyrightRestrictionBanner";
import { useCaptureFeatureFlag } from "@/utils/posthogExperiments/useCaptureFeatureFlag";

export type UnitPageProps = TeachersUnitOverviewData & { isEnabled: boolean };

export const UnitView = (props: UnitPageProps) => {
  useCaptureFeatureFlag("test-flag");

  const subjectIconName = `subject-${props.subjectSlug}` as SubjectIcon;

  const subjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: props.subjectSlug,
    phaseSlug: props.phaseSlug,
    subjectParentTitle: props.parentSubject,
    examboardSlug: props.examBoardSlug,
    pathwaySlug: props.pathwaySlug,
  });

  const downloadButtonState = useUnitDownloadButtonState();

  return (
    <>
      <UnitHeader
        heading={props.unitTitle}
        phase={props.phaseSlug}
        subjectPhaseSlug={subjectPhaseSlug}
        programmeSlug={props.programmeSlug}
        subjectIcon={subjectIconName}
        nextUnit={props.nextUnit}
        prevUnit={props.prevUnit}
        unitDownloadFileId={getUnitDownloadFileId(
          props.unitTitle,
          props.unitvariantId,
        )}
        isGeorestrictedUnit={props.containsGeorestrictedLessons}
        headerSlot={
          <Breadcrumbs
            data={props}
            subjectPhaseSlug={subjectPhaseSlug}
            mode="unit"
          />
        }
        downloadButtonState={downloadButtonState}
      />
      {props.isEnabled && <OakPrimaryButton>TEST BUTTON</OakPrimaryButton>}
      <OakBox $ph="spacing-40">
        <OakBox $mh="auto" $width={"100%"} $maxWidth={"spacing-1280"}>
          <ComplexCopyrightRestrictionBanner
            isGeorestricted={props.containsGeorestrictedLessons}
            isLoginRequired={props.containsLoginRequiredLessons}
            componentType="lesson_listing"
            unitName={props.unitTitle}
            unitSlug={props.unitSlug}
            $mv="spacing-80"
          />
        </OakBox>
      </OakBox>
      <UnitOverviewContent
        programmeSlug={props.programmeSlug}
        unitSlug={props.unitSlug}
        unitTitle={props.unitTitle}
        unitDescription={props.unitDescription}
        subjectTitle={props.subjectTitle}
        subjectSlug={props.subjectSlug}
        subjectPhaseSlug={subjectPhaseSlug}
        keyStageSlug={props.keyStageSlug}
        keyStageTitle={props.keyStageTitle}
        lessons={props.lessons}
        unitIndex={props.unitIndex}
        unitCount={props.unitCount}
        whyThisWhyNow={props.whyThisWhyNow}
        priorKnowledgeRequirements={props.priorKnowledgeRequirements}
        threads={props.threads}
        phaseSlug={props.phaseSlug}
        phaseTitle={props.phaseTitle}
        tierOptionToggles={props.tierOptionToggles}
        subjectOptionToggles={props.subjectOptionToggles}
        nextUnit={props.nextUnit}
        prevUnit={props.prevUnit}
        subjectCategories={props.subjectCategories}
        showDownloadMessage={downloadButtonState.showDownloadMessage}
        setShowDownloadMessage={downloadButtonState.setShowDownloadMessage}
        nonCurriculum={props.nonCurriculum}
        yearGroupTitle={props.yearGroupTitle}
        examBoardTitle={props.examBoardTitle}
      />
    </>
  );
};
