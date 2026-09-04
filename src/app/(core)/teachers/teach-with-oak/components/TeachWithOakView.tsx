"use client";

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
    </>
  );
};
