"use client";

import { resolveOakHref } from "@/common-lib/urls";
import {
  ExploreItem,
  WhoAreWeExplore,
} from "@/components/GenericPagesComponents/WhoAreWeExplore";
import { TeachWithOakDescription } from "@/components/TeacherComponents/TeachWithOakDescription/TeachWithOakDescription";
import { TeachWithOakHeader } from "@/components/TeacherComponents/TeachWithOakHeader/TeachWithOakHeader";

export const TeachWithOakView = ({
  backToLessonLink,
}: {
  backToLessonLink?: string;
}) => {
  return (
    <>
      <TeachWithOakHeader href={backToLessonLink} />
      <TeachWithOakDescription />
      <WhoAreWeExplore
        title={"Explore more guidance from Oak"}
        items={exploreItems}
      />
    </>
  );
};

const exploreItems: ExploreItem[] = [
  {
    iconName: "homepage-teacher-map",
    title: "Plan a lesson",
    href: resolveOakHref({
      page: "lesson-planning",
    }),
    componentType: "about_oak",
  },
  {
    iconName: "data",
    title: "Blogs",
    href: resolveOakHref({
      page: "blog-index",
    }),
    componentType: "about_oak",
  },
  {
    iconName: "chatting",
    title: "Webinars",
    href: resolveOakHref({
      page: "webinar-index",
    }),
    componentType: "about_oak",
  },
  {
    iconName: "logo",
    title: "Help",
    href: resolveOakHref({
      page: "help",
    }),
    componentType: "about_oak",
  },
];
