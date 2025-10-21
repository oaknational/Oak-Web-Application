import { NextRequest, NextResponse } from "next/server";

import { datastore } from "@/node-lib/firestore/services/datastore";
import { handleCors } from "@/app/api/_utils/cors";

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }
  const { searchParams } = new URL(request.url);
  const attemptId = searchParams.get("attempt_id");

  if (typeof attemptId !== "string" || !attemptId) {
    return NextResponse.json(
      { error: "attempt_id is required" },
      { status: 400 },
    );
  }

  const { attempts, empty } = await datastore.getLessonAttempt({ attemptId });

  if (empty) {
    return NextResponse.json({ error: "attempt not found" }, { status: 404 });
  }

  // Set cache-control header for 1 day
  const response = NextResponse.json(attempts, { status: 200 });
  response.headers.set("Cache-Control", "public, max-age=86400");
  return response;
}
