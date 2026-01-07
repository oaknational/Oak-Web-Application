import { LessonListingView } from "@oaknational/google-classroom-addon/ui";
import React from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { GoogleClassroomSubjectIconHeader } from "@/components/GoogleClassroom/GoogleClassroomSubjectIconHeader";

async function GoogleClassroomLessonsListPage({
  params,
}: Readonly<{
  params: Promise<{ programmeSlug: string; unitSlug: string }>;
}>) {
  const { programmeSlug, unitSlug } = await params;
  const { browseData } = await curriculumApi2023.pupilLessonListingQuery({
    programmeSlug,
    unitSlug,
  });
  const sortByOrderInUnit = (
    a: (typeof browseData)[0],
    b: (typeof browseData)[0],
  ) => {
    const aLessonOrder = a.supplementaryData?.orderInUnit;
    const bLessonOrder = b.supplementaryData?.orderInUnit;
    return aLessonOrder - bLessonOrder;
  };
  const orderedBrowseData = browseData.sort(sortByOrderInUnit);
  const unitData = browseData[0]?.unitData;
  const programmeFields = browseData[0]?.programmeFields;

  return (
    <LessonListingView
      unitData={unitData}
      browseData={orderedBrowseData as never}
      programmeFields={programmeFields}
      programmeSlug={programmeSlug}
      pupilLessonUrlTemplate={
        "/pupils/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug"
      }
      programmeUrlTemplate={"/classroom/browse/programmes/:programmeSlug/units"}
      headerLeftSlot={
        <GoogleClassroomSubjectIconHeader
          subjectSlug={programmeFields?.subjectSlug ?? null}
          pageType={"lesson"}
        />
      }
    />
  );
}

export default GoogleClassroomLessonsListPage;
