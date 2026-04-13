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
            href={item.href}
            onClick={item.onClick}
            lessonSectionName={item.section}
            progress={item.progress}
            numQuestions={item.numQuestions ?? 0}
            grade={item.grade ?? 0}
            data-testid={item.section}
            disabled={item.disabled}
            isLoading={item.isLoading}
          />
        </OakLI>
      ))}
    </OakFlex>
  );
};
