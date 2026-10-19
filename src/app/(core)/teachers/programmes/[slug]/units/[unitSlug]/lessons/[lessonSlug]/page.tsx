import { Metadata } from "next";
import { cache } from "react";

import {
  getSubjectHeroImageUrl,
  SubjectName,
} from "../../../../[tab]/Components/ProgrammeHeader/getSubjectHeroImageUrl";
import { Breadcrumbs } from "../Components/Breadcrumbs/Breadcrumbs";
import { getLessonResourcesMetaTitle } from "../getLessonResourcesMetaTitle";

import LessonView from "./Components/LessonView";
import LessonHeader from "./Components/LessonHeader/LessonHeader";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { curriculumApiWithCache } from "@/node-lib/cache";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

// We are using dynamic route segments so we can't enable instant navigation without
// prefetching all possible routes with generateStaticParams. Longer term we'd want to
// use Suspense boundaries to enable instant loading with data streaming
export const instant = false;

type LessonPageParams = {
  slug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getCachedLessonData = cache(
  async (programmeSlug: string, unitSlug: string, lessonSlug: string) => {
    return curriculumApiWithCache({
      queryKey: "teachersLessonOverview",
      args: [{ programmeSlug, unitSlug, lessonSlug }],
    });
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonPageParams>,
): Promise<Metadata> {
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getCachedLessonData(programmeSlug, unitSlug, lessonSlug);
    const {
      lessonTitle,
      keyStageSlug,
      year,
      subjectTitle,
      tierTitle,
      examBoardTitle,
      pathwayTitle,
    } = data;

    const title = getLessonResourcesMetaTitle({
      contentTitle: lessonTitle,
      keyStageSlug,
      year,
      subjectTitle,
      tierTitle,
      examBoardTitle,
      pathwayTitle,
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
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;

  const data = await getCachedLessonData(programmeSlug, unitSlug, lessonSlug);

  const programmeState = getProgrammeStateForLesson(data);

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={programmeState}
      accessLevel="lesson"
    >
      <LessonHeader
        heroImage={getSubjectHeroImageUrl(data.subjectSlug as SubjectName)}
        heading={data.lessonTitle}
        currentLessonSlug={data.lessonSlug}
        unitSlug={data.unitSlug}
        nextLesson={data.nextLesson}
        prevLesson={data.previousLesson}
        programmeSlug={data.programmeSlug}
        headerSlot={
          <Breadcrumbs
            subjectPhaseSlug={getTeacherSubjectPhaseSlug({
              subjectSlug: data.subjectSlug,
              phaseSlug: data.phaseSlug,
              subjectParentTitle: data.subjectParent,
              examboardSlug: data.examBoardSlug,
              pathwaySlug: data.pathwaySlug,
            })}
            mode="lesson"
          />
        }
        georestricted={data.geoRestricted}
        loginRequired={data.loginRequired}
      />
      <LessonView {...data} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const LessonPage = withPageErrorHandling(InnerLessonPage, "lesson-page::app");

export default LessonPage;
