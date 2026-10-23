import { format } from "date-fns";
import * as z from "zod";

import { getNationalCurriculumInsightsReader } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData";
import {
  nationalCurriculumInsightsPhaseSchema,
  type NationalCurriculumInsightsPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  generateNationalCurriculumInsightsDocx,
  nationalCurriculumInsightsDownloadFilename,
} from "@/pages-helpers/national-curriculum-insights/docx";
import { zipFromFiles } from "@/utils/curriculum/zip";
import { NationalCurriculumInsightsDownloadUnavailableError } from "@/pages-helpers/national-curriculum-insights/downloadLayout";
import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("national-curriculum-insights/download");

class UnavailableSelectionError extends NationalCurriculumInsightsDownloadUnavailableError {}

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
    const downloadedAt = new Date();
    const reader = getNationalCurriculumInsightsReader();
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
          throw new UnavailableSelectionError(
            "The requested subject and phase are not published.",
          );
        }

        const subject =
          await reader.nationalCurriculumInsightsSubjectBySlug(subjectSlug);
        if (
          subject?.id.replace(/^drafts\./, "") !==
            catalogueSubject.id.replace(/^drafts\./, "") ||
          !subject.tabs.some(({ kind }) => kind === phase)
        ) {
          throw new UnavailableSelectionError(
            "The requested subject is unavailable.",
          );
        }

        return {
          subjectSlug,
          filename: nationalCurriculumInsightsDownloadFilename({
            phase,
            subjectTitle: subject.title,
            downloadedAt,
          }),
          buffer: await generateNationalCurriculumInsightsDocx({
            phase: phase as NationalCurriculumInsightsPhase,
            subject,
            sharedModules: hub.modules,
            downloadedAt,
          }),
        };
      }),
    );

    const filenameCounts = new Map<string, number>();
    for (const { filename } of files) {
      const key = filename.toLowerCase();
      filenameCounts.set(key, (filenameCounts.get(key) ?? 0) + 1);
    }
    const namedFiles = files.map(
      ({ subjectSlug, filename, buffer }, index) => ({
        buffer,
        filename:
          filenameCounts.get(filename.toLowerCase()) === 1
            ? filename
            : filename.replace(
                /\.docx$/,
                ` - ${subjectSlug.slice(0, 40)}-${index + 1}.docx`,
              ),
      }),
    );

    const multiple = namedFiles.length > 1;
    const filename = multiple
      ? `National curriculum insights - ${format(downloadedAt, "dd-MM-yyyy")}.zip`
      : namedFiles[0]!.filename;
    const output = multiple
      ? await zipFromFiles(namedFiles)
      : namedFiles[0]!.buffer;

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
    if (error instanceof NationalCurriculumInsightsDownloadUnavailableError) {
      return jsonError(error.message, 400);
    }
    await reportError(
      new OakError({
        code: "downloads/generation-failed",
        originalError: error,
      }),
    );
    return jsonError("The download could not be made. Please try again.", 500);
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
