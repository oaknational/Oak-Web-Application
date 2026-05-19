import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";
import { OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonAppearsIn } from "@/components/TeacherComponents/LessonAppearsIn";
import { groupLessonPathways } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { populateLessonWithTranscript } from "@/utils/handleTranscript";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { TeacherNotesModal } from "@/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal";
import { useLesson } from "@/pages-helpers/teacher/useLesson/useLesson";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import {
  isEyfsPathway,
  redirectToEyfsPage,
} from "@/pages-helpers/shared/lesson-pages/eyfsRedirect";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";

type PageProps = {
  lesson: LessonOverviewPageData;
  topNav: TopNavProps;
};

export type URLParams = {
  lessonSlug: string;
};

export default function LessonOverviewCanonicalPage({
  lesson,
  topNav,
}: Readonly<PageProps>): JSX.Element {
  const {
    teacherNotesButton,
    TeacherNotesButtonProps,
    teacherNoteHtml,
    teacherNotesOpen,
    setTeacherNotesOpen,
    shareActivated,
    teacherNote,
    isEditable,
    saveTeacherNote,
    error,
    shareUrl,
  } = useLesson({
    lessonSlug: lesson.lessonSlug,
    source: "lesson-canonical",
    loginRequired: lesson.loginRequired,
    geoRestricted: lesson.geoRestricted,
    curriculumTrackingProps: {
      lessonName: lesson.lessonTitle,
      lessonSlug: lesson.lessonSlug,
      unitName: null,
      unitSlug: null,
      subjectSlug: null,
      subjectTitle: null,
      keyStageSlug: null,
      keyStageTitle: null,
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: lesson.lessonReleaseDate ?? "unreleased",
    },
  });

  const pathwayGroups = groupLessonPathways(lesson.pathways);
  return (
    <AppLayout
      topNavProps={topNav}
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lesson.lessonTitle}`,
          description: "Overview of lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/lessons/${lesson.lessonSlug}`,
        }),
      }}
    >
      <LessonOverview
        lesson={{
          ...lesson,
          isCanonical: true,
          teacherShareButton: teacherNotesButton,
          teacherShareButtonProps: TeacherNotesButtonProps,
          teacherNoteHtml: teacherNoteHtml,
          teacherNoteError: error,
        }}
        isBeta={false}
      />
      <OakFlex $background={"bg-decorative4-subdued"} $width={"100%"}>
        <OakMaxWidth $pv="spacing-80">
          <LessonAppearsIn {...pathwayGroups} />
        </OakMaxWidth>
      </OakFlex>
      {teacherNote && isEditable && (
        <TeacherNotesModal
          isOpen={teacherNotesOpen}
          onClose={() => {
            setTeacherNotesOpen(false);
          }}
          teacherNote={teacherNote}
          saveTeacherNote={saveTeacherNote}
          sharingUrl={shareUrl}
          error={error}
          shareActivated={shareActivated}
        />
      )}
    </AppLayout>
  );
}

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<PageProps, URLParams> = async (
  context,
): Promise<GetStaticPropsResult<PageProps>> => {
  return getPageProps({
    page: "lesson-overview-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      let lesson;
      try {
        lesson = await curriculumApi2023.lessonOverview({
          lessonSlug,
        });
        lesson = await populateLessonWithTranscript(lesson);
      } catch (error) {
        allowNotFoundError(error);
      }

      if (!lesson) {
        const redirect = await getRedirect({
          isCanonical: true,
          context: context.params,
          isTeacher: true,
          isLesson: true,
        });
        return redirect ? { redirect } : { notFound: true };
      }

      if (isEyfsPathway(lesson.pathways[0])) {
        return { redirect: redirectToEyfsPage(lesson.pathways[0]) };
      }

      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<PageProps> = {
        props: {
          lesson,
          topNav,
        },
      };

      return results;
    },
  });
};
