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
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

type LessonPageParams = {
  slug: string;
  unitSlug: string;
  lessonSlug: string;
};

export const dynamic = "force-static";

const getCachedLessonData = cache(
  cacheData(
    async (programmeSlug: string, unitSlug: string, lessonSlug: string) => {
      return curriculumApi2023.teachersLessonOverview({
        programmeSlug,
        unitSlug,
        lessonSlug,
      });
    },
    ["teachers-lesson-overview"],
  ),
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
            data={data}
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
