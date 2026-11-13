import { notFound } from "next/navigation";

import OakError from "@/errors/OakError";
import { GoogleClassroomSubjectIconHeader } from "@/components/GoogleClassroom/GoogleClassroomSubjectIconHeader";
import { GoogleClassroomLessonListing } from "@/components/GoogleClassroom/GoogleClassroomLessonListing";
import { curriculumApiWithCache } from "@/node-lib/cache";

async function getLessonsData(programmeSlug: string, unitSlug: string) {
  try {
    return await curriculumApiWithCache({
      queryKey: "pupilLessonListingQuery",
      args: [{ programmeSlug, unitSlug }],
    });
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

async function GoogleClassroomLessonsListPage({
  params,
}: Readonly<{
  params: Promise<{ programmeSlug: string; unitSlug: string }>;
}>) {
  const { programmeSlug, unitSlug } = await params;
  const { browseData } = await getLessonsData(programmeSlug, unitSlug);

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
    <GoogleClassroomLessonListing
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
