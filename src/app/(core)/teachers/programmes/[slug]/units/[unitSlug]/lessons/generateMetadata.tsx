import { Metadata } from "next";

import { getCachedUnitData } from "./getCachedUnitData";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { AppPageProps } from "@/hocs/withPageErrorHandling";

type LessonsPageParams = { slug: string; unitSlug: string };

export const dynamic = "force-static";

export async function generateMetadata(
  props: AppPageProps<LessonsPageParams>,
): Promise<Metadata> {
  const { slug: programmeSlug, unitSlug } = await props.params;

  try {
    const data = await getCachedUnitData(programmeSlug, unitSlug);
    const {
      unitTitle,
      keyStageSlug,
      year,
      subjectTitle,
      examBoardTitle,
      tierTitle,
    } = data;

    const tierSegment = tierTitle ? ` ${tierTitle}` : "";
    const examboardSegment = examBoardTitle ? ` ${examBoardTitle}` : "";

    const title = `${unitTitle} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle}${tierSegment}${examboardSegment} | Lesson Resources`;
    const description = `Free lessons and teaching resources about ${unitTitle.toLowerCase()}`;

    return {
      title,
      description,
      openGraph: getOpenGraphMetadata({ title, description }),
      twitter: getTwitterMetadata({ title, description }),
    };
  } catch {
    return {};
  }
}
