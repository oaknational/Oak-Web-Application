import { PlanALessonProps } from "@/pages/lesson-planning-new";

export const getNavItems = ({ pageData }: PlanALessonProps) => {
  const navItems = pageData.content
    .map((section) => {
      if (section.type === "PlanALessonPageContent") {
        return {
          title: section.navigationTitle,
          href: `#${section.anchorSlug.current}`,
        };
      }
    })
    .filter(
      (item): item is { title: string; href: string } => item !== undefined,
    );
  return navItems;
};
