import { format } from "date-fns";
import { cdata, safeXml } from "@ooxml-tools/xml";

import { xmlElementToJson } from "@/pages-helpers/curriculum/docx/xml";
import {
  appendBodyElements,
  cmToTwip,
  generateEmptyDocx,
} from "@/pages-helpers/curriculum/docx/docx";
import type {
  NationalCurriculumInsightsModule,
  NationalCurriculumInsightsPage,
  NationalCurriculumInsightsPhase,
  NationalCurriculumInsightsSubject,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

type PortableTextBlock = {
  children?: Array<{ text?: string }>;
  listItem?: string;
  style?: string;
};

const phaseLabel = (phase: NationalCurriculumInsightsPhase) =>
  phase === "primary" ? "Primary" : "Secondary";

const textRun = (text: string, bold = false) => safeXml`
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
      ${bold ? safeXml`<w:b />` : ""}
      <w:color w:val="222222" />
      <w:sz w:val="22" />
    </w:rPr>
    <w:t xml:space="preserve">${cdata(text)}</w:t>
  </w:r>
`;

const paragraph = (text: string, style?: string) => safeXml`
  <w:p>
    <w:pPr>
      ${style ? safeXml`<w:pStyle w:val="${style}" />` : ""}
      <w:spacing w:after="160" w:line="276" w:lineRule="auto" />
    </w:pPr>
    ${textRun(text, Boolean(style))}
  </w:p>
`;

const portableTextParagraphs = (value: unknown) => {
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      const typedBlock = block as PortableTextBlock;
      const text =
        typedBlock.children
          ?.map(({ text: childText }) => childText ?? "")
          .join("")
          .trim() ?? "";
      if (!text) return "";

      const prefix = typedBlock.listItem ? "• " : "";
      const style =
        typedBlock.style === "h2" || typedBlock.style === "heading2"
          ? "Heading3"
          : typedBlock.style === "h3" || typedBlock.style === "heading3"
            ? "Heading4"
            : undefined;
      return paragraph(`${prefix}${text}`, style);
    })
    .join("");
};

const tableXml = (rows: Array<{ cells: string[] }> | undefined): string => {
  if (!rows?.length) return "";

  return safeXml`
    <w:tbl>
      <w:tblPr>
        <w:tblBorders>
          <w:top w:val="single" w:sz="8" w:color="808080" />
          <w:left w:val="single" w:sz="8" w:color="808080" />
          <w:bottom w:val="single" w:sz="8" w:color="808080" />
          <w:right w:val="single" w:sz="8" w:color="808080" />
          <w:insideH w:val="single" w:sz="8" w:color="B8B8B8" />
          <w:insideV w:val="single" w:sz="8" w:color="B8B8B8" />
        </w:tblBorders>
      </w:tblPr>
      ${rows.map(
        (row) => safeXml`
          <w:tr>
            ${row.cells.map(
              (cell) => safeXml`
                <w:tc>
                  <w:tcPr>
                    <w:tcW w:w="0" w:type="auto" />
                  </w:tcPr>
                  ${paragraph(cell)}
                </w:tc>
              `,
            )}
          </w:tr>
        `,
      )}
    </w:tbl>
    ${paragraph("")}
  `;
};

const moduleXml = (module: NationalCurriculumInsightsModule): string => {
  switch (module.__typename) {
    case "NationalCurriculumInsightsHeroSection":
      return `${paragraph(module.heading, "Heading1")}${portableTextParagraphs(module.bodyPortableText)}`;
    case "NationalCurriculumInsightsOverviewSection":
      return `${paragraph(module.heading, "Heading2")}${portableTextParagraphs(module.bodyPortableText)}`;
    case "NationalCurriculumInsightsRichTextSection":
      return `${paragraph(module.heading, "Heading2")}${portableTextParagraphs(module.contentPortableText)}`;
    case "NationalCurriculumInsightsImageTextSection":
      return `${paragraph(module.heading, "Heading2")}${portableTextParagraphs(module.bodyPortableText)}`;
    case "NationalCurriculumInsightsFaqSection":
      return `${paragraph(module.heading, "Heading2")}${module.items
        .map(
          (item) =>
            `${paragraph(item.question, "Heading3")}${portableTextParagraphs(item.answerPortableText)}`,
        )
        .join("")}`;
    case "NationalCurriculumInsightsVideoCardsSection":
      return `${paragraph(module.heading, "Heading2")}${portableTextParagraphs(module.introductionPortableText)}${module.cards
        .map(
          (card) =>
            `${paragraph(card.heading, "Heading3")}${paragraph(card.description)}`,
        )
        .join("")}`;
    case "NationalCurriculumInsightsQuoteSection":
      return `${paragraph(`“${module.quote}”`, "Quote")}${paragraph(
        `— ${module.attribution}${module.role ? `, ${module.role}` : ""}`,
      )}`;
    case "NationalCurriculumInsightsTableSection":
      return `${paragraph(module.heading, "Heading2")}${tableXml(module.table.rows)}`;
    case "NationalCurriculumInsightsPhaseCardsSection":
      return module.cards
        .map((card) => paragraph(`${card.heading}: ${card.linkLabel}`))
        .join("");
    case "NationalCurriculumInsightsKeyStageCardsSection":
      return module.cards
        .map((card) => paragraph(`${card.heading}: ${card.linkLabel}`))
        .join("");
    case "NationalCurriculumInsightsPromotionalHeadingSection":
      return paragraph(module.heading, "Heading2");
    case "NationalCurriculumInsightsPhaseNavigationSection":
    case "NationalCurriculumInsightsSubjectNavigationSection":
    case "NationalCurriculumInsightsNewsletterSection":
    case "NationalCurriculumInsightsDownloadSection":
      return "";
  }
};

const pageXml = (page: NationalCurriculumInsightsPage) =>
  `${paragraph(page.title, "Heading1")}${paragraph(page.summary)}${page.modules
    .map(moduleXml)
    .join("")}`;

export const nationalCurriculumInsightsDownloadFilename = ({
  phase,
  subjectTitle,
}: {
  phase: NationalCurriculumInsightsPhase;
  subjectTitle: string;
}) =>
  `National curriculum insights - ${subjectTitle} - ${phaseLabel(phase)} - ${format(
    new Date(),
    "dd-MM-yyyy",
  )}.docx`;

export const generateNationalCurriculumInsightsDocx = async ({
  phase,
  subject,
}: {
  phase: NationalCurriculumInsightsPhase;
  subject: NationalCurriculumInsightsSubject;
}) => {
  const tab = subject.tabs.find(({ kind }) => kind === phase);
  if (!tab) {
    throw new Error(`${subject.title} does not have a ${phase} page`);
  }

  const zip = await generateEmptyDocx();
  const documentXml = safeXml`
    <root>
      ${paragraph("National Curriculum Insights", "Title")}
      ${paragraph(`${subject.title} — ${phaseLabel(phase)}`, "Subtitle")}
      ${paragraph(`Downloaded ${format(new Date(), "d MMMM yyyy")}`)}
      ${pageXml(tab.page)}
      ${tab.page.keyStages.map(
        ({ keyStage, label, page }) => safeXml`
          <w:p>
            <w:r>
              <w:br w:type="page" />
            </w:r>
          </w:p>
          ${paragraph(
            `${label} (${keyStage})`,
            "Heading1",
          )}
          ${paragraph(page.summary)}
          ${page.modules.map(
            moduleXml,
          )}
        `,
      )}
      <w:sectPr>
        <w:pgSz w:w="11909" w:h="16834" />
        <w:pgMar
          w:top="${cmToTwip(2)}"
          w:right="${cmToTwip(2)}"
          w:bottom="${cmToTwip(2)}"
          w:left="${cmToTwip(2)}"
          w:header="${cmToTwip(1.25)}"
          w:footer="${cmToTwip(1.25)}"
          w:gutter="0"
        />
      </w:sectPr>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(documentXml)?.elements);
  return Buffer.from(await zip.zipToBuffer());
};
