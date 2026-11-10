import { resolveOakHref } from "@/common-lib/urls";

export const allExploreItems = [
  {
    iconName: "logo" as const,
    title: "About Oak",
    href: resolveOakHref({
      page: "about-who-we-are",
    }),
    componentType: "about_oak" as const,
  },
  {
    iconName: "homepage-teacher-map" as const,
    title: "Oak's curricula",
    href: resolveOakHref({
      page: "about-oaks-curricula",
    }),
    componentType: "about_curriculum" as const,
  },
  {
    iconName: "data" as const,
    title: "Oak's impact",
    href: resolveOakHref({
      page: "about-oaks-impact",
    }),
    componentType: "about_curriculum" as const,
  },
  {
    iconName: "snack-break" as const,
    title: "Meet the team",
    href: resolveOakHref({
      page: "about-meet-the-team",
    }),
    componentType: "meet_the_team" as const,
  },
  {
    iconName: "chatting" as const,
    title: "Get involved",
    href: resolveOakHref({
      page: "about-get-involved",
    }),
    componentType: "get_involved" as const,
  },
  {
    iconName: "teacher-group" as const,
    title: "Join the research panel",
    href: resolveOakHref({
      page: "about-join-research-panel",
    }),
    componentType: "join_research_panel" as const,
  },
  {
    iconName: "books" as const,
    title: "Case studies",
    href: resolveOakHref({
      page: "about-case-study-library",
    }),
    componentType: "case_studies" as const,
  },
];
