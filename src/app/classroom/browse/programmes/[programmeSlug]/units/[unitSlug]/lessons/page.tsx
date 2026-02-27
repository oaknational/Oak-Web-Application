import { notFound } from "next/navigation";
import React from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { GoogleClassroomSubjectIconHeader } from "@/components/GoogleClassroom/GoogleClassroomSubjectIconHeader";
import { GoogleClassroomLessonListingAnalytics } from "@/components/GoogleClassroom/GoogleClassroomLessonListingAnalytics";

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
  if (!browseData?.length) {
    notFound();
  }

  const sortByOrderInUnit = (
    a: (typeof browseData)[0],
    b: (typeof browseData)[0],
  ) => {
    const aLessonOrder = a.supplementaryData?.orderInUnit;
    const bLessonOrder = b.supplementaryData?.orderInUnit;
    return aLessonOrder - bLessonOrder;
  };
  const orderedBrowseData = [...browseData].sort(sortByOrderInUnit);
  const unitData = orderedBrowseData[0]?.unitData;
  const programmeFields = orderedBrowseData[0]?.programmeFields;
  if (!unitData || !programmeFields) {
    notFound();
  }

  return (
    <GoogleClassroomLessonListingAnalytics
      unitData={unitData}
      browseData={orderedBrowseData}
      programmeFields={programmeFields}
      programmeSlug={programmeSlug}
      pupilLessonUrlTemplate={
        "/pupils/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug"
      }
      programmeUrlTemplate={"/classroom/browse/programmes/:programmeSlug/units"}
      headerLeftSlot={
        <GoogleClassroomSubjectIconHeader
          key={programmeFields?.subjectSlug}
          subjectSlug={programmeFields?.subjectSlug ?? null}
          pageType={"lesson"}
        />
      }
    />
  );
}

export default GoogleClassroomLessonsListPage;
