import { Metadata } from "next";
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
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { TeacherBrowseAnalyticsStore } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsStore";

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
    } = data;

    const tierSegment = tierTitle ? ` ${tierTitle}` : "";
    const examboardSegment = examBoardTitle ? ` ${examBoardTitle}` : "";
    const title = `${lessonTitle} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle}${tierSegment}${examboardSegment} | Lesson Resources`;

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

  const programmeState: TeacherBrowseAnalyticsStore["programmeState"] = {
    browseLevel: "lesson",
    subject: {
      slug: data.subjectSlug,
      title: data.subjectTitle,
    },
    phase: {
      slug: data.phaseSlug,
      title: data.phaseTitle,
    },
    year: {
      slug: data.year,
      title: data.yearGroupTitle,
    },
    keystage: {
      slug: data.keyStageSlug,
      title: data.keyStageTitle,
    },
    tier: data.tierTitle
      ? {
          slug: data.tierTitle,
          title: data.tierTitle,
        }
      : null,
    examboard: data.examBoardTitle
      ? {
          slug: data.examBoardSlug ?? data.examBoardTitle,
          title: data.examBoardTitle,
        }
      : null,
    pathway: data.pathwayTitle
      ? {
          slug: data.pathwaySlug ?? data.pathwayTitle,
          title: data.pathwayTitle,
        }
      : null,
    unit: {
      slug: data.unitSlug,
      title: data.unitTitle,
    },
    lesson: {
      slug: data.lessonSlug,
      title: data.lessonTitle,
      lessonReleaseDate: data.lessonReleaseDate ?? "unpublished",
    },
  };

  return (
    <TeacherBrowseAnalyticsStoreProvider programmeState={{ programmeState }}>
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
