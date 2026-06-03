import { pickSectionProgress } from "../Shared";

import type { LessonOverviewSectionName } from "@/components/PupilComponents/Views/PupilLessonOverview";
import type { SectionNavItem } from "@/components/PupilComponents/Views/PupilLessonOverview/PupilLessonOverviewSectionsNav/PupilLessonOverviewSectionsNav";
import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import {
  allLessonReviewSections,
  type LessonReviewSection,
} from "@/components/PupilComponents/lessonSections";

type BuildOverviewSectionItemsParams = {
  lessonReviewSections: Readonly<LessonReviewSection[]>;
  sectionResults: LessonSectionResults;
  isReadOnly: boolean;
  isHydratingInitialProgress: boolean;
  starterQuizNumQuestions: number;
  exitQuizNumQuestions: number;
  onSectionClick?: (section: LessonReviewSection) => void;
  getSectionHref: (section: LessonReviewSection) => string | undefined;
};

export const buildOverviewSectionItems = ({
  lessonReviewSections,
  sectionResults,
  isReadOnly,
  isHydratingInitialProgress,
  starterQuizNumQuestions,
  exitQuizNumQuestions,
  onSectionClick = () => {},
  getSectionHref,
}: BuildOverviewSectionItemsParams): SectionNavItem[] => {
  return allLessonReviewSections.map((section) => {
    const overviewSection = section as LessonOverviewSectionName;
    const isSectionAvailable = lessonReviewSections.includes(section);
    const onClick = isSectionAvailable
      ? () => onSectionClick(section)
      : () => {};
    const href = isSectionAvailable ? (getSectionHref(section) ?? "#") : "#";
    const disabled = !isSectionAvailable;

    if (section === "starter-quiz") {
      return {
        section: overviewSection,
        href,
        progress: pickSectionProgress({ section, sectionResults }),
        numQuestions: starterQuizNumQuestions,
        grade: sectionResults[section]?.grade ?? 0,
        disabled:
          disabled ||
          Boolean(sectionResults[section]?.isComplete) ||
          isReadOnly,
        isLoading: isHydratingInitialProgress,
        onClick,
      };
    }

    if (section === "exit-quiz") {
      return {
        section: overviewSection,
        href,
        progress: pickSectionProgress({ section, sectionResults }),
        numQuestions: exitQuizNumQuestions,
        grade: sectionResults[section]?.grade ?? 0,
        disabled:
          disabled ||
          Boolean(sectionResults[section]?.isComplete) ||
          isReadOnly,
        isLoading: isHydratingInitialProgress,
        onClick,
      };
    }

    return {
      section: overviewSection,
      href,
      progress: pickSectionProgress({ section, sectionResults }),
      ...(disabled ? { disabled } : {}),
      isLoading: isHydratingInitialProgress,
      onClick,
    };
  });
};
