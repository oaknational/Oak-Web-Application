import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { UnitView } from "./Components/UnitView";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getFeatureFlagValue } from "@/utils/featureFlags";

type LessonsPageParams = { subjectPhaseSlug: string; unitSlug: string };

const getCachedUnitData = cache(
  async (
    subjectPhaseSlug: string,
    unitSlug: string,
    subjectCategorySlug?: string,
  ) => {
    return curriculumApi2023.teachersUnitOverview({
      programmeSlug: subjectPhaseSlug,
      unitSlug,
      subjectCategorySlug,
    });
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonsPageParams>,
): Promise<Metadata> {
  const { subjectPhaseSlug, unitSlug } = await props.params;
  const searchParams = await props.searchParams;

  try {
    const data = await getCachedUnitData(
      subjectPhaseSlug,
      unitSlug,
      searchParams?.subject_category?.toString(),
    );
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

  const { subjectPhaseSlug, unitSlug } = await props.params;
  const searchParams = await props.searchParams;
  const data = await getCachedUnitData(
    subjectPhaseSlug,
    unitSlug,
    searchParams?.subject_category?.toString(),
  );
  return (
    <UnitView
      programmeSlug={data.programmeSlug}
      unitSlug={data.unitSlug}
      unitTitle={data.unitTitle}
      unitDescription={data.unitDescription}
      subjectTitle={data.subjectTitle}
      subjectSlug={data.subjectSlug}
      keyStageSlug={data.keyStageSlug}
      keyStageTitle={data.keyStageTitle}
      lessons={data.lessons}
      unitIndex={data.unitIndex}
      unitCount={data.unitCount}
    />
  );
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
