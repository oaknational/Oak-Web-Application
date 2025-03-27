import { GetStaticPropsContext, GetStaticPropsResult, PreviewData } from "next";

import { resolveOakHref } from "@/common-lib/urls";
import {
  isLessonReviewSection,
  isLessonSection,
} from "@/components/PupilComponents/LessonEngineProvider";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";
import {
  pickAvailableSectionsForLesson,
  PupilExperienceViewProps,
} from "@/components/PupilViews/PupilExperience";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { invariant } from "@/utils/invariant";
import { WorksheetInfo } from "@/components/PupilViews/PupilIntro";
import { getWorksheetInfo } from "@/components/PupilComponents/pupilUtils/getWorksheetInfo";

export type PupilLessonPageURLParams = {
  lessonSlug: string;
  unitSlug?: string;
  programmeSlug?: string;
  section: string;
};

type PageType = "preview" | "canonical" | "browse";

export const getProps = ({
  page,
  context,
}: {
  page: PageType;
  context: GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;
}): (() => Promise<GetStaticPropsResult<PupilExperienceViewProps>>) => {
  return async () => {
    if (!context.params) {
      throw new Error("context.params is undefined");
    }
    const { lessonSlug, unitSlug, programmeSlug, section } = context.params;

    if (page === "browse") {
      invariant(unitSlug, "unitSlug is required for browse page");
      invariant(programmeSlug, "programmeSlug is required for browse page");
    }

    // 404 if the section is not valid
    if (!isLessonSection(section)) {
      return {
        notFound: true,
      };
    }

    const res = await (() => {
      switch (page) {
        case "preview":
          return curriculumApi2023.pupilPreviewLessonQuery({
            lessonSlug,
          });
        case "canonical":
          return curriculumApi2023.pupilLessonQuery({
            lessonSlug,
          });
        case "browse":
          return curriculumApi2023.pupilLessonQuery({
            programmeSlug,
            lessonSlug,
            unitSlug,
          });
        default:
          throw new Error(`Invalid page type: ${page}`);
      }
    })();

    if (!res) {
      return {
        notFound: true,
      };
    }

    const { browseData, content } = res;

    let worksheetInfo: WorksheetInfo | null = null;

    if (content.hasWorksheetAssetObject) {
      worksheetInfo = (await getWorksheetInfo(lessonSlug)) || [];
    }

    // 404 if the lesson does not contain the given section
    if (
      isLessonReviewSection(section) &&
      !pickAvailableSectionsForLesson(content).includes(section)
    ) {
      return {
        notFound: true,
      };
    }

    const backUrl =
      page === "browse" && unitSlug && programmeSlug
        ? resolveOakHref({
            page: "pupil-lesson-index",
            programmeSlug,
            unitSlug,
          })
        : resolveOakHref({ page: "pupil-year-index" });

    const transcriptSentences = await requestLessonResources({
      lessonContent: content,
    }).catch((e) => {
      if (page === "preview") {
        return [];
      } else {
        throw e;
      }
    });

    const results: GetStaticPropsResult<PupilExperienceViewProps> = {
      props: {
        lessonContent: {
          ...content,
          transcriptSentences: transcriptSentences ?? [],
        },
        browseData,
        hasWorksheet: !!content.hasWorksheetAssetObject,
        worksheetInfo,
        hasAdditionalFiles: !!content.downloadableFiles?.length,
        additionalFiles: content.downloadableFiles || null,
        initialSection: section,
        backUrl,
        pageType: page,
      },
    };

    return results;
  };
};
