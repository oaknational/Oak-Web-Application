import { groupBy } from "lodash";
import {
  UnitsListingView,
  UnitCards,
} from "@oaknational/google-classroom-addon/ui";
import React from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { extractBaseSlug } from "@/pages-helpers/pupil";
import { checkAndExcludeUnitsWithAgeRestrictedLessons } from "@/pages-helpers/pupil/units-page/units-page-helper";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { GoogleClassroomSubjectIconHeader } from "@/components/GoogleClassroom/GoogleClassroomSubjectIconHeader";
import { UnitsContainer } from "@/components/TeacherComponents/UnitsContainer";

async function GoogleClassroomUnitsListingPage({
  params,
}: Readonly<{
  params: Promise<{ programmeSlug: string }>;
}>) {
  const { programmeSlug } = await params;
  const baseSlug = extractBaseSlug(programmeSlug);
  const curriculumData = await curriculumApi2023.pupilUnitListingQuery({
    baseSlug,
  });

  if (!curriculumData) {
    return <>404</>;
  }

  curriculumData.sort((a, b) => {
    const aUnitOrder = a.supplementaryData.unitOrder;
    const bUnitOrder = b.supplementaryData.unitOrder;
    return aUnitOrder - bUnitOrder;
  });

  const unitsByProgramme = groupBy(curriculumData, "programmeSlug");

  const allUnits = checkAndExcludeUnitsWithAgeRestrictedLessons(
    unitsByProgramme[programmeSlug] ?? [],
  );

  const optionalityUnits: UnitListingBrowseData[number][][] = Object.values(
    groupBy(allUnits, (unit) =>
      unit.programmeFields.optionality
        ? unit.unitSlug.replace(/-\d+$/, "")
        : unit.unitSlug,
    ),
  );

  const selectedProgramme = curriculumData.find(
    (unit) => unit.programmeSlug === programmeSlug,
  );

  if (!selectedProgramme || !allUnits) return;

  const { programmeFields } = selectedProgramme;

  return (
    <UnitsListingView
      yearSlug={programmeFields.yearSlug}
      programmeUnits={optionalityUnits}
      programmeData={programmeFields}
      subjectsUrlTemplate={"/classroom/browse/years/:yearSlug/subjects"}
      headerLeftSlot={
        <GoogleClassroomSubjectIconHeader
          key={programmeFields.subjectSlug}
          subjectSlug={programmeFields.subjectSlug}
          pageType={"unit"}
        />
      }
    >
      <UnitsContainer
        isLegacy={false}
        showHeader={false}
        phase={programmeFields.phase}
        subject={programmeFields.subject ?? ""}
        unitCards={[
          <UnitCards
            key={programmeSlug}
            units={optionalityUnits}
            programmeSlug={programmeSlug}
            unitsLessonListUrlTemplate={
              "/classroom/browse/programmes/:programmeSlug/units/:unitSlug/lessons"
            }
          />,
        ]}
        curriculumHref={null}
      />
    </UnitsListingView>
  );
}

export default GoogleClassroomUnitsListingPage;
