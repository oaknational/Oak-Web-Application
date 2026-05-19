import { LessonSection } from "@/components/PupilComponents/lessonSections";

type GetNewLessonSectionHrefParams = {
  currentRoute: string;
  section: LessonSection;
  searchParams?: URLSearchParams;
};

export const getNewLessonSectionHref = ({
  currentRoute,
  section,
  searchParams,
}: GetNewLessonSectionHrefParams) => {
  const nextSearchParams = new URLSearchParams(searchParams);
  nextSearchParams.delete("section");

  const queryString = nextSearchParams.toString();
  const suffix = queryString.length > 0 ? `?${queryString}` : "";

  const currentRouteExclSection = currentRoute
    .split("/")
    .slice(0, -1)
    .join("/");

  return `${currentRouteExclSection}/${section}${suffix}`;
};
