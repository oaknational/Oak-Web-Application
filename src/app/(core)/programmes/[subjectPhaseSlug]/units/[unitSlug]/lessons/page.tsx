import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";

import UnitHeader from "./Components/UnitHeader/UnitHeader";
import { UnitBreadCrumbs } from "./Components/UnitBreadcrumbs/UnitBreadcrumbs";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { SubjectIcon } from "@/components/TeacherComponents/Header/Header";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";

type LessonsPageParams = { subjectPhaseSlug: string; unitSlug: string };

const getCachedUnitData = cache(
  async (subjectPhaseSlug: string, unitSlug: string) => {
    return curriculumApi2023.teachersUnitOverview({
      programmeSlug: subjectPhaseSlug,
      unitSlug,
    });
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<LessonsPageParams>;
}): Promise<Metadata> {
  const { subjectPhaseSlug, unitSlug } = await params;

  try {
    const data = await getCachedUnitData(subjectPhaseSlug, unitSlug);
    const { unitTitle, keyStageSlug, year, subjectTitle } = data;

    const title = `${unitTitle} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle} Lesson Resources`;
    const description = `Free lessons and teaching resources about ${unitTitle.toLowerCase()}`;

    return {
      title,
      description,
      openGraph: getOpenGraphMetadata({ title, description }),
      twitter: getTwitterMetadata({ title, description }),
    };
  } catch {
    return {};
  }
}

const InnerUnitPage = async (props: AppPageProps<LessonsPageParams>) => {
  const isEnabled = await getFeatureFlagValue(
    "teachers-integrated-journey",
    "boolean",
  );

  if (!isEnabled) {
    return notFound();
  }

  const { subjectPhaseSlug: programmeSlug, unitSlug } = await props.params;
  const data = await getCachedUnitData(programmeSlug, unitSlug);
  const subjectIconName = `subject-${data.subjectSlug}` as SubjectIcon;

  const subjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: data.subjectSlug,
    phaseSlug: data.phaseSlug,
    subjectParentTitle: data.parentSubject,
    examboardSlug: data.examBoardSlug,
  });

  return (
    <UnitHeader
      heading={data.unitTitle}
      phase={data.phaseSlug}
      subjectPhaseSlug={subjectPhaseSlug}
      programmeSlug={programmeSlug}
      subjectIcon={subjectIconName}
      nextUnit={data.nextUnit}
      prevUnit={data.prevUnit}
      unitDownloadFileId={
        unitSlug.endsWith(data.unitvariantId.toString())
          ? unitSlug
          : `${unitSlug}-${data.unitvariantId}`
      }
      isGeorestrictedUnit={data.containsGeorestrictedLessons}
      trackingProps={{
        unitName: data.unitTitle,
        unitSlug: data.unitSlug,
        keyStageSlug: data.keyStageSlug,
        keyStageTitle: data.keyStageTitle as KeyStageTitleValueType,
        subjectSlug: data.subjectSlug,
        subjectTitle: data.subjectTitle,
      }}
      headerSlot={
        <UnitBreadCrumbs data={data} subjectPhaseSlug={subjectPhaseSlug} />
      }
    />
  );
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
