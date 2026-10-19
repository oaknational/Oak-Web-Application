import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Breadcrumbs } from "../../Components/Breadcrumbs/Breadcrumbs";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { populateMediaClipsWithTranscripts } from "@/utils/handleTranscript";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { applyCurriculumCachePolicy } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

// We are using dynamic route segments so we can't enable instant navigation without
// prefetching all possible routes with generateStaticParams. Longer term we'd want to
// use Suspense boundaries to enable instant loading with data streaming
export const instant = false;

type LessonMediaPageParams = {
  slug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getCachedLessonMediaClipsData = cache(
  async (programmeSlug: string, unitSlug: string, lessonSlug: string) => {
    "use cache";
    applyCurriculumCachePolicy();

    return curriculumApi2023.lessonMediaClips<LessonMediaClipsData>({
      programmeSlug,
      unitSlug,
      lessonSlug,
    });
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonMediaPageParams>,
): Promise<Metadata> {
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getCachedLessonMediaClipsData(
      programmeSlug,
      unitSlug,
      lessonSlug,
    );
    const title = `Lesson Media: ${data.lessonTitle} | ${data.keyStageSlug.toUpperCase()} ${data.subjectTitle}`;
    const description = "Extra video and audio for the lesson";

    return {
      title,
      description,
      robots: {
        index: false,
        follow: false,
      },
      openGraph: getOpenGraphMetadata({ title, description }),
      twitter: getTwitterMetadata({ title, description }),
    };
  } catch {
    return {};
  }
}

const InnerLessonMediaPage = async (
  props: AppPageProps<LessonMediaPageParams>,
) => {
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;

  const data = await getCachedLessonMediaClipsData(
    programmeSlug,
    unitSlug,
    lessonSlug,
  );

  if (!data.mediaClips) {
    return notFound();
  }

  const mediaClipsWithTranscripts = await populateMediaClipsWithTranscripts(
    data.mediaClips,
  );

  const lessonData: LessonMediaClipsData = {
    ...data,
    mediaClips: mediaClipsWithTranscripts,
  };

  const breadcrumbsSubjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: data.subjectSlug,
    phaseSlug: data.phaseSlug,
    subjectParentTitle: data.subjectParent,
    examboardSlug: data.examBoardSlug,
    pathwaySlug: data.pathwaySlug,
  });

  const programmeState = getProgrammeStateForLesson(lessonData);

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={programmeState}
      accessLevel="lesson"
    >
      <LessonMedia
        isCanonical={false}
        lesson={lessonData}
        breadcrumbsSlot={
          <Breadcrumbs
            key="lesson-media-breadcrumbs"
            subjectPhaseSlug={breadcrumbsSubjectPhaseSlug}
            mode="media"
          />
        }
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const LessonMediaPage = withPageErrorHandling(
  InnerLessonMediaPage,
  "lesson-media-page::app",
);

export default LessonMediaPage;
