"use client";

import { ShortReads } from "./ShortReads/ShortReads";
import { TeachWithOakDescription } from "./TeachWithOakDescription/TeachWithOakDescription";
import { TeachWithOakHeader } from "./TeachWithOakHeader/TeachWithOakHeader";

import { resolveOakHref } from "@/common-lib/urls";
import {
  ExploreItem,
  WhoAreWeExplore,
} from "@/components/GenericPagesComponents/WhoAreWeExplore";

export const TeachWithOakView = ({
  backToLessonLink,
}: {
  backToLessonLink?: string;
}) => {
  return (
    <>
      <TeachWithOakHeader href={backToLessonLink} />
      <TeachWithOakDescription />
      <ShortReads />
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
