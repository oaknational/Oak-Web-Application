import { GetStaticPropsContext, GetStaticPropsResult, PreviewData } from "next";

import { getRedirect } from "../../shared/lesson-pages/getRedirects";
import { allowNotFoundError } from "../../shared/lesson-pages/allowNotFoundError";

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
import convertToMml from "@/utils/mathjax";
import { LessonContent, QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export type PupilLessonPageURLParams = {
  lessonSlug: string;
  unitSlug?: string;
  programmeSlug?: string;
  section: string;
};

type PageType = "preview" | "canonical" | "browse";

export type QuizQuestionWithHtml = QuizQuestion & {
  questionStem?: QuizQuestion["questionStem"] & {
    html?: string
  } | null
}
function convertQuestionMath (questions: QuizQuestion[]): QuizQuestionWithHtml[] {
  return questions.map(question => {
    if (question.questionStem) {
      return {
        ...question,
        questionStem: question.questionStem.map(questionStem => {
          if (questionStem.type === "text") {
            // TODO: This should escape text here, rather than just replacing
            const html = questionStem.text.replace(/\$\$([^$]|$[^\$])*\$\$/g, (item: string) => {
              return convertToMml({math: item});
            })
            return {
              type: questionStem.type,
              text: questionStem.text,
              html,
            };
          } else {
            return questionStem;
          }
        })
      };
    } else {
      return question;
    }
  })
} 

function convertQuizes (content: LessonContent) {
  return {
    ...content,
    starterQuiz: convertQuestionMath(content.starterQuiz),
    exitQuiz: convertQuestionMath(content.exitQuiz),
  }
}

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
    let res;
    try {
      res = await (() => {
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
    } catch (innerError) {
      allowNotFoundError(innerError);
    }
    if (!res) {
      const redirect = await (async () => {
        switch (page) {
          case "canonical": {
            return await getRedirect({
              isCanonical: true,
              context: context.params!,
              isTeacher: false,
              isLesson: true,
            });
          }
          case "browse": {
            return await getRedirect({
              isCanonical: false,
              context: context.params!,
              isTeacher: false,
              isLesson: true,
            });
          }
          case "preview":
            return undefined; // No redirects for preview page
          default:
            throw new Error(`Invalid page type: ${page}`);
        }
      })();
      return redirect ? { redirect } : { notFound: true };
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
          ...convertQuizes(content),
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
