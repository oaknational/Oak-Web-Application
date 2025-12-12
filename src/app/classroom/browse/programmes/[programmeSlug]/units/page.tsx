import { groupBy } from "lodash";
import { UnitsListingView } from "@oaknational/google-classroom-addon/ui";
import React from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { extractBaseSlug } from "@/pages-helpers/pupil";
import { checkAndExcludeUnitsWithAgeRestrictedLessons } from "@/pages-helpers/pupil/units-page/units-page-helper";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { GoogleClassroomSubjectIconHeader } from "@/components/GoogleClassroom/GoogleClassroomSubjectIconHeader";

async function GoogleClassroomUnitsListingPage({
  params,
}: {
  params: Promise<{ programmeSlug: string }>;
}) {
  const { programmeSlug } = await params;
  const baseSlug = extractBaseSlug(programmeSlug);
  const curriculumData = await curriculumApi2023.pupilUnitListingQuery({
    baseSlug,
  });

  if (!curriculumData) {
    // todo: redirect to 404
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
        ? unit.unitSlug.replace(/-\d+?$/, "")
        : unit.unitSlug,
    ),
  );

  const selectedProgramme = curriculumData.find(
    (unit) => unit.programmeSlug === programmeSlug,
  );

  if (!selectedProgramme || !allUnits) return; // todo: 404

  const { programmeFields } = selectedProgramme;

  return (
    <UnitsListingView
      programmeSlug={programmeSlug}
      yearSlug={programmeFields.yearSlug}
      programmeUnits={optionalityUnits}
      programmeData={programmeFields}
      unitsLessonListUrlTemplate={
        "/classroom/browse/programmes/:programmeSlug/units/:unitSlug/lessons"
      }
      subjectsUrlTemplate={"/classroom/browse/years/:yearSlug/subjects"}
      headerLeftSlot={
        <GoogleClassroomSubjectIconHeader
          subjectSlug={programmeFields.subjectSlug}
          pageType={"unit"}
        />
      }
    />
  );
}

export default GoogleClassroomUnitsListingPage;
