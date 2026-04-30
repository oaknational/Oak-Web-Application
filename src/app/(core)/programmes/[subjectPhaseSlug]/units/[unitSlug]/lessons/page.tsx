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
  async (subjectPhaseSlug: string, unitSlug: string) => {
    return curriculumApi2023.teachersUnitOverview({
      programmeSlug: subjectPhaseSlug,
      unitSlug,
    });
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonsPageParams>,
): Promise<Metadata> {
  const { subjectPhaseSlug, unitSlug } = await props.params;

  try {
    const data = await getCachedUnitData(subjectPhaseSlug, unitSlug);
    const {
      unitTitle,
      keyStageSlug,
      year,
      subjectTitle,
      examBoardTitle,
      tierTitle,
    } = data;

    const tierSegment = tierTitle ? ` ${tierTitle}` : "";
    const examboardSegment = examBoardTitle ? ` ${examBoardTitle}` : "";

    const title = `${unitTitle} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle}${tierSegment}${examboardSegment} | Lesson Resources`;
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

  return <UnitView {...data} />;
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
