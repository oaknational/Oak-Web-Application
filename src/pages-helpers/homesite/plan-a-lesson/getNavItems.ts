import { PlanALessonPage } from "@/common-lib/cms-types/planALessonPage";

export const getNavItems = (pageData: PlanALessonPage) => {
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
