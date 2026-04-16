import { LessonSection } from "@/components/PupilComponents/LessonEngineProvider";

type GetNewLessonSectionHrefParams = {
  lessonSlug: string;
  section: LessonSection;
  searchParams?: URLSearchParams;
};

export const getNewLessonSectionHref = ({
  lessonSlug,
  section,
  searchParams,
}: GetNewLessonSectionHrefParams) => {
  const nextSearchParams = new URLSearchParams(searchParams);
  nextSearchParams.delete("section");

  const queryString = nextSearchParams.toString();
  const suffix = queryString.length > 0 ? `?${queryString}` : "";

  return `/pupils/lessons/${encodeURIComponent(
    lessonSlug,
  )}/new/${section}${suffix}`;
};
