import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  getCachedLessonMediaClipsData,
  getLessonMediaRestriction,
} from "@/app/(core)/teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]/media/getLessonMediaClipsData";
import { populateMediaClipsWithTranscripts } from "@/utils/handleTranscript";

const noStore = { "Cache-Control": "private, no-store" };

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{
      programmeSlug: string;
      unitSlug: string;
      lessonSlug: string;
    }>;
  },
) {
  const { programmeSlug, unitSlug, lessonSlug } = await params;

  let data;
  try {
    data = await getCachedLessonMediaClipsData(
      programmeSlug,
      unitSlug,
      lessonSlug,
    );
  } catch {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: noStore },
    );
  }

  if (!data.mediaClips) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: noStore },
    );
  }

  const { isRestricted, isGeoRestricted } = getLessonMediaRestriction(data);

  if (isRestricted) {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: noStore },
      );
    }
    const owa = user.publicMetadata?.owa;
    if (
      !owa?.isOnboarded ||
      (isGeoRestricted && owa.isRegionAuthorised === false)
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: noStore },
      );
    }
  }

  const mediaClips = await populateMediaClipsWithTranscripts(data.mediaClips);

  return NextResponse.json({ mediaClips }, { headers: noStore });
}
