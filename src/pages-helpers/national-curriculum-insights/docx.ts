import { join } from "node:path";

import { format } from "date-fns";
import { cdata, safeXml } from "@ooxml-tools/xml";

import {
  getNationalCurriculumInsightsDownloadLayout,
  NationalCurriculumInsightsDownloadUnavailableError,
} from "./downloadLayout";
import patterns from "./docx/patterns.json";
import {
  createInsightsDocxRichText,
  wordParagraph,
  wordText,
} from "./docx/richText";
import { buildInsightsDocxContent } from "./docx/content";
import { fillInsightsDocxFurniture } from "./docx/furniture";
import { validateInsightsDocxContent } from "./docx/validation";
import { addInsightsDocxStyles } from "./docx/styles";

import { xmlElementToJson } from "@/pages-helpers/curriculum/docx/xml";
import {
  appendBodyElements,
  generateEmptyOoxml,
} from "@/pages-helpers/curriculum/docx/docx";
import type {
  NationalCurriculumInsightsModule,
  NationalCurriculumInsightsPhase,
  NationalCurriculumInsightsSubject,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import {
  nationalCurriculumInsightsPath,
  nationalCurriculumInsightsSubjectPhaseHref,
} from "@/common-lib/urls/nationalCurriculumInsights";

const phaseLabel = (phase: NationalCurriculumInsightsPhase) =>
  phase === "primary" ? "Primary" : "Secondary";

const filenameSubject = (title: string) => {
  const normalized = title
    .normalize("NFC")
    .replace(/[<>:"/\\|?*]|\p{Cc}/gu, " ")
    .replace(/\s+/g, " ");
  let start = 0;
  let end = normalized.length;
  while (start < end && ". ".includes(normalized[start]!)) start += 1;
  while (end > start && ". ".includes(normalized[end - 1]!)) end -= 1;
  const cleaned = normalized.slice(start, end);
  let output = "";
  for (const character of cleaned) {
    if (Buffer.byteLength(output + character, "utf8") > 128) break;
    output += character;
  }
  return output.trim() || "Subject";
};

export const nationalCurriculumInsightsDownloadFilename = ({
  phase,
  subjectTitle,
  downloadedAt = new Date(),
}: {
  phase: NationalCurriculumInsightsPhase;
  subjectTitle: string;
  downloadedAt?: Date;
}) =>
  `National curriculum insights - ${filenameSubject(subjectTitle)} - ${phaseLabel(phase)} - ${format(
    downloadedAt,
    "dd-MM-yyyy",
  )}.docx`;

export const generateNationalCurriculumInsightsDocx = async ({
  phase,
  subject,
  sharedModules = [],
  siteUrl = getBrowserConfig("seoAppUrl") ||
    getBrowserConfig("clientAppBaseUrl"),
}: {
  phase: NationalCurriculumInsightsPhase;
  subject: NationalCurriculumInsightsSubject;
  sharedModules?: NationalCurriculumInsightsModule[];
  siteUrl?: string;
  downloadedAt?: Date;
}) => {
  const tab = subject.tabs.find(({ kind }) => kind === phase);
  if (!tab || subject.id?.startsWith("drafts.")) {
    throw new NationalCurriculumInsightsDownloadUnavailableError(
      "The requested subject and phase are not published.",
    );
  }
  const { keyStages } = getNationalCurriculumInsightsDownloadLayout(
    tab.page,
    phase,
  );
  validateInsightsDocxContent({
    page: tab.page,
    stages: keyStages,
    sharedModules,
  });
  const zip = await generateEmptyOoxml(
    join(
      process.cwd(),
      "src/pages-helpers/national-curriculum-insights/docx/template.docx",
    ),
  );
  await addInsightsDocxStyles(zip);
  const pageUrl = new URL(
    nationalCurriculumInsightsSubjectPhaseHref(subject.slug, phase),
    siteUrl,
  ).toString();
  const hubUrl = new URL(nationalCurriculumInsightsPath, siteUrl).toString();
  const richText = createInsightsDocxRichText(zip, pageUrl);
  const { cover, contents, body } = await buildInsightsDocxContent({
    page: tab.page,
    stages: keyStages,
    subjectTitle: subject.title,
    richText,
    sharedModules,
  });
  const title = `Changes to the national curriculum: ${phase} ${subject.title}`;
  const header = tab.page.modules.find(
    (module) => module.__typename === "NationalCurriculumInsightsHeaderSection",
  );
  const phaseStageLabel = phase === "primary" ? "KS1 and KS2" : "KS3 and KS4";
  const stageLabel = keyStages.length
    ? keyStages.map(({ keyStage }) => keyStage).join(" and ")
    : phaseStageLabel;
  if (!header)
    throw new NationalCurriculumInsightsDownloadUnavailableError(
      "The phase introduction is not available yet.",
    );
  const introduction = await richText.render(header.bodyPortableText, {
    properties: patterns.coverSummaryProperties,
    size: 14,
  });
  const editorialDate = header.lastUpdatedAt;
  const formattedDate = editorialDate
    ? format(new Date(editorialDate + "T12:00:00Z"), "d MMMM yyyy")
    : "";
  const date = patterns.coverDateParagraph.replace(
    "{{editorialDate}}",
    editorialDate ? cdata(`Last updated ${formattedDate}`) : "",
  );
  const documentXml = safeXml`
    <root>
      ${patterns.artwork}
      ${wordParagraph(wordText(title), {
        properties: patterns.coverTitleProperties,
      })}
      ${wordParagraph(wordText(stageLabel, { bold: true, size: 16 }), {
        properties: patterns.coverSubtitleProperties,
      })}
      ${introduction}
      ${date}
      ${cover}
      <w:p>
        <w:pPr>
          <w:pageBreakBefore />
          <w:pStyle w:val="Heading2" />
          <w:keepNext />
          <w:spacing w:after="360" />
        </w:pPr>
        ${wordText("Contents")}
      </w:p>
      ${contents}
      ${body}
      ${patterns.section}
    </root>
  `;
  const document = await zip.readJson("word/document.xml");
  document.elements[0]!.elements![0].elements ??= [];
  await appendBodyElements(zip, xmlElementToJson(documentXml)?.elements);
  await fillInsightsDocxFurniture(zip, title, hubUrl);
  await richText.finish();
  return Buffer.from(await zip.zipToBuffer());
};
