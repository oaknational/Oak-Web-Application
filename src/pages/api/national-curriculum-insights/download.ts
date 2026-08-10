import type { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import * as z from "zod";

import {
  nationalCurriculumInsightsPhaseSchema,
  type NationalCurriculumInsightsPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import { getNationalCurriculumInsightsReader } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/getNationalCurriculumInsightsData";
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

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST").status(405).end();
    return;
  }

  const parsed = requestSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Select at least one valid subject." });
    return;
  }

  try {
    const reader = getNationalCurriculumInsightsReader();
    const hub = await reader.nationalCurriculumInsightsHub();
    if (!hub) {
      response
        .status(503)
        .json({ error: "Curriculum insights are unavailable." });
      return;
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

    response
      .setHeader(
        "Content-Type",
        multiple
          ? "application/zip"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      )
      .setHeader("Cache-Control", "private, no-store")
      .setHeader("Content-Disposition", attachmentHeader(filename))
      .setHeader("x-filename", filename)
      .status(200)
      .send(output);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The download could not be made.";
    response.status(400).json({ error: message });
  }
}
