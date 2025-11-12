import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import errorReporter from "@/common-lib/error-reporter";
import { identifyPiiFromString, PiiCheckResponse } from "@/node-lib/dlp";
import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";
import {
  TeacherNoteError,
  teacherNoteSchema,
} from "@/node-lib/pupil-api/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const noteId = searchParams.get("note_id");
  const sidKey = searchParams.get("sid_key");

  if (typeof noteId !== "string") {
    return NextResponse.json({ error: "note_id is required" }, { status: 400 });
  }

  if (typeof sidKey !== "string") {
    return NextResponse.json({ error: "sid_key is required" }, { status: 400 });
  }

  const doc = await pupilDatastore.getTeacherNote({ noteId, sidKey });
  if (!doc) {
    return NextResponse.json({ error: "note not found" }, { status: 404 });
  }
  const response = NextResponse.json(doc, { status: 200 });
  return response;
}

export async function POST(request: NextRequest) {
  let data;
  try {
    const body = await request.json();
    data = teacherNoteSchema.parse(body);
  } catch (e) {
    if (e instanceof ZodError) {
      errorReporter("teacher-note-validation")(new Error(e.message), {
        severity: "warning",
      });
      return NextResponse.json(e.format(), { status: 400 });
    }
  }
  if (!data)
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  const noteId = data.note_id;
  const sidKey = data.sid_key;

  const existing = await pupilDatastore.getTeacherNote({ noteId, sidKey });

  const [textPii, htmlPii] = await Promise.all([
    identifyPiiFromString(data.note_text),
    identifyPiiFromString(data.note_html),
  ]);
  const foundPii = (check: PiiCheckResponse) =>
    check.matches.length > 0 && check.redactedText;

  // if error, res.status 400 and form the PII error obj
  if (foundPii(textPii) || foundPii(htmlPii)) {
    const detectedPii = foundPii(textPii) ? textPii : htmlPii;
    const error: TeacherNoteError = {
      type: "PII_ERROR",
      pii: {
        fullRedactedString: detectedPii.redactedText as string,
        piiMatches: detectedPii.matches,
      },
    };
    return NextResponse.json(error, { status: 400 });
  }

  // else upsert send result with correct status code
  const result = await pupilDatastore.upsertTeacherNote(data);
  const response = NextResponse.json(result, { status: existing ? 200 : 201 });
  return response;
}

export async function PUT() {
  pupilDatastore.batchUpdateTeacherNotes(async (doc) => {
    const [textPii, htmlPii] = await Promise.all([
      identifyPiiFromString(doc.note_text),
      identifyPiiFromString(doc.note_html),
    ]);
    doc.checkedForPii = true;
    const foundPii = (check: PiiCheckResponse) =>
      check.matches.length > 0 && check.redactedText;
    const [textMatched, htmlMatched] = [foundPii(textPii), foundPii(htmlPii)];
    if (textMatched) doc.note_text = textPii.redactedText as string;
    if (htmlMatched) doc.note_html = htmlPii.redactedText as string;
    console.log(
      `Redacting teacher note ${doc.note_id}. ${textMatched ? "Redacted PII from text." : "No PII found in text."} ${htmlMatched ? "Redacted PII from HTML." : "No PII found in HTML."}`,
    );
    return doc;
  });
  return NextResponse.json(
    { message: "Redaction on stored teacher notes started successfully" },
    { status: 200 },
  );
}
