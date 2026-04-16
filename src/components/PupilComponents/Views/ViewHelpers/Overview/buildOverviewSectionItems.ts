import { pickSectionProgress } from "../Shared";

import type { LessonOverviewSectionName } from "@/components/PupilComponents/Views/PupilLessonOverview";
import type { SectionNavItem } from "@/components/PupilComponents/Views/PupilLessonOverview/PupilLessonOverviewSectionsNav";
import type {
  LessonReviewSection,
  LessonSectionResults,
} from "@/components/PupilComponents/LessonEngineProvider";

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
  const sectionItems: SectionNavItem[] = [];

  lessonReviewSections.forEach((section) => {
    const overviewSection = section as LessonOverviewSectionName;
    const onClick = () => onSectionClick(section);
    const href = getSectionHref(section) ?? "#";

    if (section === "starter-quiz") {
      sectionItems.push({
        section: overviewSection,
        href,
        progress: pickSectionProgress({ section, sectionResults }),
        numQuestions: starterQuizNumQuestions,
        grade: sectionResults[section]?.grade ?? 0,
        disabled: sectionResults[section]?.isComplete || isReadOnly,
        isLoading: isHydratingInitialProgress,
        onClick,
      });
      return;
    }

    if (section === "exit-quiz") {
      sectionItems.push({
        section: overviewSection,
        href,
        progress: pickSectionProgress({ section, sectionResults }),
        numQuestions: exitQuizNumQuestions,
        grade: sectionResults[section]?.grade ?? 0,
        disabled: sectionResults[section]?.isComplete || isReadOnly,
        isLoading: isHydratingInitialProgress,
        onClick,
      });
      return;
    }

    sectionItems.push({
      section: overviewSection,
      href,
      progress: pickSectionProgress({ section, sectionResults }),
      isLoading: isHydratingInitialProgress,
      onClick,
    });
  });

  return sectionItems;
};
