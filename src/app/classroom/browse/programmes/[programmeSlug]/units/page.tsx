import { groupBy } from "lodash";
import { UnitsListingView } from "@oaknational/google-classroom-addon/ui";
import { notFound } from "next/navigation";
import React from "react";

import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { extractBaseSlug } from "@/pages-helpers/pupil";
import { checkAndExcludeUnitsWithAgeRestrictedLessons } from "@/pages-helpers/pupil/units-page/units-page-helper";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { GoogleClassroomSubjectIconHeader } from "@/components/GoogleClassroom/GoogleClassroomSubjectIconHeader";
import { UnitsContainer } from "@/components/TeacherComponents/UnitsContainer";
import { GoogleClassroomUnitCards } from "@/components/GoogleClassroom/GoogleClassroomUnitCards";

async function getUnitsData(baseSlug: string) {
  try {
    return await curriculumApi2023.pupilUnitListingQuery({ baseSlug });
  } catch (error) {
    if (
      error instanceof OakError &&
      error.code === "curriculum-api/not-found"
    ) {
      notFound();
    }
    throw error;
  }
}

async function GoogleClassroomUnitsListingPage({
  params,
}: Readonly<{
  params: Promise<{ programmeSlug: string }>;
}>) {
  const { programmeSlug } = await params;

  const baseSlug = extractBaseSlug(programmeSlug);
  const curriculumData = await getUnitsData(baseSlug);

  if (!curriculumData) {
    notFound();
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
  if (!allUnits?.length) {
    notFound();
  }

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

  if (!selectedProgramme) {
    notFound();
  }

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
          <GoogleClassroomUnitCards
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
