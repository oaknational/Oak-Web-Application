"use client";
import React from "react";

import { SubjectName, getSubjectHeroImageUrl } from "./getSubjectHeroImageUrl";

import {
  Header,
  LargeHeaderProps,
} from "@/components/TeacherComponents/Header/Header";

export type ProgrammeHeaderProps = Omit<
  LargeHeaderProps,
  "heading" | "heroImage"
> & {
  heading: string;
  /**
   * The subject of the programme.
   */
  subject: SubjectName;
};

export const ProgrammeHeader = (props: ProgrammeHeaderProps) => {
  const { subject, heading } = props;

  const subjectHeroImage = getSubjectHeroImageUrl(subject);

  return <Header {...props} heroImage={subjectHeroImage} heading={heading} />;
};
