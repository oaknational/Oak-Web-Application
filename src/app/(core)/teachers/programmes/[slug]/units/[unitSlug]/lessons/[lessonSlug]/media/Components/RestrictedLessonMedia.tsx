"use client";

import type { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";

import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import errorReporter from "@/common-lib/error-reporter";
import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

const reportError = errorReporter("RestrictedLessonMedia");

type RestrictedLessonMediaProps = {
  lesson: LessonMediaClipsData;
  breadcrumbsSlot: ReactNode;
};

const fetchMediaClips = async (
  url: string,
): Promise<Pick<LessonMediaClipsData, "mediaClips"> | null> => {
  const res = await fetch(url);
  // Access is decided by the route; LessonMedia shows the restricted prompt
  if (res.status === 401 || res.status === 403) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch lesson media clips: ${res.status}`);
  }
  return res.json();
};

/**
 * Media clips for restricted lessons are excluded from the static page payload
 * and fetched from an auth-checked route once Clerk has a fresh session.
 */
export const RestrictedLessonMedia = ({
  lesson,
  breadcrumbsSlot,
}: RestrictedLessonMediaProps) => {
  const { isLoaded, isSignedIn } = useUser();

  const { programmeSlug, unitSlug, lessonSlug } = lesson;
  const { data } = useSWR(
    isLoaded && isSignedIn
      ? `/api/lesson-media/${encodeURIComponent(programmeSlug)}/${encodeURIComponent(unitSlug)}/${encodeURIComponent(lessonSlug)}`
      : null,
    fetchMediaClips,
    { revalidateOnFocus: false, onError: (error) => reportError(error) },
  );

  return (
    <LessonMedia
      // remount once clips arrive so the initial clip state is derived from them
      key={data ? "loaded" : "pending"}
      isCanonical={false}
      lesson={{ ...lesson, mediaClips: data?.mediaClips ?? {} }}
      breadcrumbsSlot={breadcrumbsSlot}
    />
  );
};
