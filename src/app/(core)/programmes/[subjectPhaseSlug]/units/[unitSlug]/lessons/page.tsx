import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { LessonList } from "./Components/LessonList";

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

  const { subjectPhaseSlug, unitSlug } = await props.params;
  const data = await getCachedUnitData(subjectPhaseSlug, unitSlug);

  return (
    <LessonList
      programmeSlug={data.programmeSlug}
      unitSlug={data.unitSlug}
      unitTitle={data.unitTitle}
      subjectTitle={data.subjectTitle}
      subjectSlug={data.subjectSlug}
      keyStageSlug={data.keyStageSlug}
      keyStageTitle={data.keyStageTitle}
      lessons={data.lessons.map((lesson) => ({
        lessonSlug: lesson.lessonSlug,
        lessonTitle: lesson.lessonTitle,
        pupilLessonOutcome:
          "pupilLessonOutcome" in lesson
            ? lesson.pupilLessonOutcome
            : undefined,
        orderInUnit: lesson.orderInUnit,
        isUnpublished: lesson.isUnpublished,
      }))}
      unitIndexLabel={data.yearTitle}
      lessonCount={data.lessons.length}
    />
  );
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
