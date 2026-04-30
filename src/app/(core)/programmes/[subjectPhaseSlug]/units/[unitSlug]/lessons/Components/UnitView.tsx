import UnitHeader from "./UnitHeader/UnitHeader";
import { Breadcrumbs } from "./Breadcrumbs/Breadcrumbs";
import { UnitOverviewContent } from "./UnitOverviewContent/UnitOverviewContent";

import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { SubjectIcon } from "@/components/TeacherComponents/Header/Header";

export type UnitPageProps = TeachersUnitOverviewData;

export const UnitView = (props: UnitPageProps) => {
  const subjectIconName = `subject-${props.subjectSlug}` as SubjectIcon;

  const subjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: props.subjectSlug,
    phaseSlug: props.phaseSlug,
    subjectParentTitle: props.parentSubject,
    examboardSlug: props.examBoardSlug,
    pathwaySlug: props.pathwaySlug,
  });

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
        unitDownloadFileId={
          props.unitSlug.endsWith(props.unitvariantId.toString())
            ? props.unitSlug
            : `${props.unitSlug}-${props.unitvariantId}`
        }
        isGeorestrictedUnit={props.containsGeorestrictedLessons}
        trackingProps={{
          unitName: props.unitTitle,
          unitSlug: props.unitSlug,
          keyStageSlug: props.keyStageSlug,
          keyStageTitle: props.keyStageTitle as KeyStageTitleValueType,
          subjectSlug: props.subjectSlug,
          subjectTitle: props.subjectTitle,
        }}
        headerSlot={
          <Breadcrumbs
            data={props}
            subjectPhaseSlug={subjectPhaseSlug}
            mode="unit"
          />
        }
      />
      <UnitOverviewContent
        programmeSlug={props.programmeSlug}
        unitSlug={props.unitSlug}
        unitTitle={props.unitTitle}
        unitDescription={props.unitDescription}
        subjectTitle={props.subjectTitle}
        subjectSlug={props.subjectSlug}
        keyStageSlug={props.keyStageSlug}
        keyStageTitle={props.keyStageTitle}
        lessons={props.lessons}
        unitIndex={props.unitIndex}
        unitCount={props.unitCount}
        whyThisWhyNow={props.whyThisWhyNow}
        priorKnowledgeRequirements={props.priorKnowledgeRequirements}
        threads={props.threads}
        phaseSlug={props.phaseSlug}
        tierOptionToggles={props.tierOptionToggles}
        subjectOptionToggles={props.subjectOptionToggles}
        nextUnit={props.nextUnit}
        prevUnit={props.prevUnit}
        subjectCategories={props.subjectCategories}
      />
    </>
  );
};
