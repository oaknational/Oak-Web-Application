import { format } from "date-fns";
import * as z from "zod";

import {
  nationalCurriculumInsightsPhaseSchema,
  type NationalCurriculumInsightsPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import CMSClient from "@/node-lib/cms";
import {
  generateNationalCurriculumInsightsDocx,
  nationalCurriculumInsightsDownloadFilename,
} from "@/pages-helpers/national-curriculum-insights/docx";
import { zipFromFiles } from "@/utils/curriculum/zip";

const requestSchema = z.object({
  selections: z
    .array(
      z.object({
        phase: nationalCurriculumInsightsPhaseSchema,
        subjectSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      }),
    )
    .min(1)
    .max(50),
});

const attachmentHeader = (filename: string) =>
  `attachment; filename="${filename.replace(/["\\]/g, "")}"`;

const jsonError = (error: string, status: number) =>
  Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );

const selectionFromQuery = (selection: string) => {
  const [subjectSlug, phase, ...unexpected] = selection.split(":");
  return unexpected.length === 0 ? { phase, subjectSlug } : null;
};

const createDownload = async (selections: unknown) => {
  const parsed = requestSchema.safeParse({ selections });
  if (!parsed.success) {
    return jsonError("Select at least one valid subject.", 400);
  }

  try {
    const reader = CMSClient;
    const hub = await reader.nationalCurriculumInsightsHub();
    if (!hub) {
      return jsonError("Curriculum insights are unavailable.", 503);
    }

    const uniqueSelections = [
      ...new Map(
        parsed.data.selections.map((selection) => [
          `${selection.subjectSlug}:${selection.phase}`,
          selection,
        ]),
      ).values(),
    ];

    const files = await Promise.all(
      uniqueSelections.map(async ({ phase, subjectSlug }) => {
        const catalogueSubject = hub.subjects.find(
          ({ slug }) => slug === subjectSlug,
        );
        if (!catalogueSubject?.tabs.some(({ kind }) => kind === phase)) {
          throw new Error("The requested subject and phase are not published.");
        }

        const subject =
          await reader.nationalCurriculumInsightsSubjectBySlug(subjectSlug);
        if (!subject) {
          throw new Error("The requested subject is unavailable.");
        }

        return {
          filename: nationalCurriculumInsightsDownloadFilename({
            phase,
            subjectTitle: subject.title,
          }),
          buffer: await generateNationalCurriculumInsightsDocx({
            phase: phase as NationalCurriculumInsightsPhase,
            subject,
          }),
        };
      }),
    );

    const multiple = files.length > 1;
    const filename = multiple
      ? `National curriculum insights - ${format(new Date(), "dd-MM-yyyy")}.zip`
      : files[0]!.filename;
    const output = multiple ? await zipFromFiles(files) : files[0]!.buffer;

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": attachmentHeader(filename),
        "Content-Type": multiple
          ? "application/zip"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "x-filename": filename,
      },
    });
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "The download could not be made.",
      400,
    );
  }
};

export async function GET(request: Request) {
  const selections = new URL(request.url).searchParams
    .getAll("selection")
    .map(selectionFromQuery);
  return createDownload(selections);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => undefined)) as
    | { selections?: unknown }
    | undefined;
  return createDownload(body?.selections);
}
