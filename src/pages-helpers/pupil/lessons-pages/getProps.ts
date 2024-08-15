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

export type PupilLessonPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
  section: string;
};

type PageType = "preview" | "canonical" | "browse";

export const getProps = ({
  page,
  context,
}: {
  page: PageType;
  context: GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;
}) => {
  return async () => {
    if (!context.params) {
      throw new Error("context.params is undefined");
    }
    const { lessonSlug, unitSlug, programmeSlug, section } = context.params;

    // 404 if the section is not valid
    if (!isLessonSection(section)) {
      return {
        notFound: true,
      };
    }

    const res = await curriculumApi2023.pupilLessonQuery({
      programmeSlug,
      lessonSlug,
      unitSlug,
    });

    if (!res) {
      return {
        notFound: true,
      };
    }

    const { browseData, content } = res;

    // 404 if the lesson does not contain the given section
    if (
      isLessonReviewSection(section) &&
      !pickAvailableSectionsForLesson(content).includes(section)
    ) {
      return {
        notFound: true,
      };
    }

    const backUrl = resolveOakHref({
      page: "pupil-lesson-index",
      programmeSlug,
      unitSlug,
    });

    const { transcriptSentences, hasWorksheet } = await requestLessonResources({
      lessonContent: content,
    });

    const results: GetStaticPropsResult<PupilExperienceViewProps> = {
      props: {
        lessonContent: {
          ...content,
          transcriptSentences: transcriptSentences ?? [],
        },
        browseData,
        hasWorksheet,
        initialSection: section,
        backUrl,
      },
    };

    return results;
  };
};
