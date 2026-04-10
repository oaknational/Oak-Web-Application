import { type NextRequest, NextResponse } from "next/server";

import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

/**
 * Throwaway route to exercise `teachersLessonOverview` locally.
 * Example: /api/test-teachers-lesson-overview?lessonSlug=...&unitSlug=...&programmeSlug=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lessonSlug = searchParams.get("lessonSlug");
  const unitSlug = searchParams.get("unitSlug");
  const programmeSlug = searchParams.get("programmeSlug");

  if (!lessonSlug || !unitSlug || !programmeSlug) {
    return NextResponse.json(
      {
        error:
          "Missing required query params: lessonSlug, unitSlug, programmeSlug",
      },
      { status: 400 },
    );
  }

  try {
    const data = await curriculumApi2023.teachersLessonOverview({
      lessonSlug,
      unitSlug,
      programmeSlug,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (
      error instanceof OakError &&
      error.code === "curriculum-api/not-found"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    throw error;
  }
}
