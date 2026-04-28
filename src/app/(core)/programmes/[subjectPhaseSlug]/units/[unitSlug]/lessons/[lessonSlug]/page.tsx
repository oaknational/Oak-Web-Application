import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import {
  getSubjectHeroImageUrl,
  SubjectName,
} from "../../../../[tab]/Components/ProgrammeHeader/getSubjectHeroImageUrl";
import { Breadcrumbs } from "../Components/Breadcrumbs/Breadcrumbs";

import LessonView from "./Components/LessonView";
import LessonHeader from "./Components/LessonHeader/LessonHeader";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";

type LessonPageParams = {
  subjectPhaseSlug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getCachedLessonData = cache(
  async (
    programmeSlug: string,
    unitSlug: string,
    lessonSlug: string,
  ): Promise<TeachersLessonOverviewPageData> => {
    return curriculumApi2023.teachersLessonOverview({
      programmeSlug,
      unitSlug,
      lessonSlug,
    });
  },
);

const getTitleForMetadata = ({
  lessonTitle,
  tierTitle,
  examBoardTitle,
  keyStageSlug,
  year,
  subjectTitle,
}: {
  lessonTitle: string;
  tierTitle: string | null | undefined;
  examBoardTitle: string | null | undefined;
  keyStageSlug: string;
  year: string;
  subjectTitle: string;
}) => {
  const optionalTitles = [tierTitle, examBoardTitle].filter(Boolean).join(" ");
  const optionalTitlesPart = optionalTitles ? ` ${optionalTitles}` : "";

  return `${lessonTitle}${optionalTitlesPart} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle} Lesson Resources`;
};

export async function generateMetadata(
  props: AppPageProps<LessonPageParams>,
): Promise<Metadata> {
  const { subjectPhaseSlug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getCachedLessonData(
      subjectPhaseSlug,
      unitSlug,
      lessonSlug,
    );
    const {
      lessonTitle,
      keyStageSlug,
      year,
      subjectTitle,
      tierTitle,
      examBoardTitle,
    } = data;

    const title = getTitleForMetadata({
      lessonTitle,
      tierTitle,
      examBoardTitle,
      keyStageSlug,
      year,
      subjectTitle,
    });
    const description =
      "View lesson content and choose resources to download or share";

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

const InnerLessonPage = async (props: AppPageProps<LessonPageParams>) => {
  const isEnabled = await getFeatureFlagValue(
    "teachers-integrated-journey",
    "boolean",
  );

  if (!isEnabled) {
    return notFound();
  }

  const {
    subjectPhaseSlug: programmeSlug,
    unitSlug,
    lessonSlug,
  } = await props.params;

  const data = await getCachedLessonData(programmeSlug, unitSlug, lessonSlug);

  return (
    <>
      <LessonHeader
        heroImage={getSubjectHeroImageUrl(data.subjectSlug as SubjectName)}
        heading={data.lessonTitle}
        currentLessonSlug={data.lessonSlug}
        nextLesson={data.nextLesson}
        prevLesson={data.previousLesson}
        programmeSlug={data.programmeSlug}
        unitSlug={data.unitSlug}
        headerSlot={
          <Breadcrumbs
            data={data}
            subjectPhaseSlug={getTeacherSubjectPhaseSlug({
              subjectSlug: data.subjectSlug,
              phaseSlug: data.phaseSlug,
              subjectParentTitle: data.subjectParent,
              examboardSlug: data.examBoardSlug,
              pathwaySlug: data.pathwaySlug,
            })}
          />
        }
        georestricted={data.geoRestricted}
        loginRequired={data.loginRequired}
      />
      <LessonView {...data} />
    </>
  );
};

const LessonPage = withPageErrorHandling(InnerLessonPage, "lesson-page::app");

export default LessonPage;
