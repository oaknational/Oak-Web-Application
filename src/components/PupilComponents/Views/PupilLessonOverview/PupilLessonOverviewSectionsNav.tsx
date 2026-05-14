import Link from "next/link";
import { OakFlex, OakLI, OakLessonNavItem } from "@oaknational/oak-components";

import {
  LessonOverviewSectionName,
  LessonOverviewSectionProgress,
} from "./lessonOverviewSections";

export type SectionNavItem = {
  section: LessonOverviewSectionName;
  href: string;
  progress: LessonOverviewSectionProgress;
  isLoading: boolean;
  disabled?: boolean;
  numQuestions?: number;
  grade?: number;
  onClick: () => void;
};

export type PupilLessonOverviewSectionsNavProps = {
  items: SectionNavItem[];
};

export const PupilLessonOverviewSectionsNav = ({
  items,
}: PupilLessonOverviewSectionsNavProps) => {
  const getQuizProps = (
    section: LessonOverviewSectionName,
    item: SectionNavItem,
  ) => {
    return [
      LessonOverviewSectionName.StarterQuiz,
      LessonOverviewSectionName.ExitQuiz,
    ].includes(section)
      ? {
          numQuestions: item.numQuestions ?? 0,
          grade: item.grade ?? 0,
        }
      : {};
  };
  return (
    <OakFlex
      as="ul"
      $ma="spacing-0"
      $pa="spacing-0"
      $gap="spacing-16"
      $flexDirection="column"
    >
      {items.map((item) => (
        <OakLI key={item.section} $listStyle="none">
          <OakLessonNavItem
            as={Link}
            href={item.href}
            onClick={() => item.onClick()}
            lessonSectionName={item.section}
            progress={item.progress}
            numQuestions={item.numQuestions ?? 0}
            grade={item.grade ?? 0}
            data-testid={item.section}
            disabled={item.disabled}
            isLoading={item.isLoading}
            {...getQuizProps(item.section, item)}
          />
        </OakLI>
      ))}
    </OakFlex>
  );
};
