import { safeXml } from "@ooxml-tools/xml";

import patterns from "./patterns.json";
import { insightsFaqQuestionStyle, insightsHeadlineStyle } from "./styles";
import {
  getInsightsDocxPhaseHeadlines,
  isClosingModule,
  selectInsightsDocxClosingModules,
} from "./validation";
import {
  createInsightsDocxRichText,
  wordParagraph,
  wordText,
  type ParagraphOptions,
} from "./richText";

import type {
  NationalCurriculumInsightsKeyStagePage,
  NationalCurriculumInsightsModule,
  NationalCurriculumInsightsPage,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

type RichText = ReturnType<typeof createInsightsDocxRichText>;
type Overview = Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsOverviewSection" }
>;

const paragraph = (text: string, options: ParagraphOptions = {}) =>
  wordParagraph(wordText(text, options), options);

const sectionHeading = (text: string) =>
  paragraph(text, {
    style: "Heading3",
    keepNext: true,
    before: 480,
    after: 240,
  });

const closingHeading = (text: string) =>
  paragraph(text, {
    style: "Heading2",
    keepNext: true,
    before: 480,
    after: 240,
  });

const contentsLabel = (
  section: NationalCurriculumInsightsModule,
): string | undefined => {
  switch (section.__typename) {
    case "NationalCurriculumInsightsChangesSection":
      return "What's changed";
    case "NationalCurriculumInsightsUnchangedSection":
      return "What's stayed the same";
    case "NationalCurriculumInsightsChecklistSection":
      return section.audience === "teacher"
        ? "Teacher checklist"
        : "School leader checklist";
    default:
      return "heading" in section && typeof section.heading === "string"
        ? section.heading
        : undefined;
  }
};

const spacer = () =>
  wordParagraph("", {
    properties: safeXml`
      <w:pPr>
        <w:spacing w:after="0" w:line="80" w:lineRule="exact" />
      </w:pPr>
    `,
  });

const estimatePreparationLines = (text: string) =>
  text
    .split(/\r\n|\r|\n/)
    .reduce(
      (lines, line) => lines + Math.max(1, Math.ceil(line.length / 70)),
      0,
    );

const quoteXml = (
  quote: { quote: string; attribution: string; role?: string | null },
  color: string,
) => safeXml`
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9526" w:type="dxa" />
    </w:tblPr>
    <w:tblGrid>
      <w:gridCol w:w="9526" />
    </w:tblGrid>
    <w:tr>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="9526" w:type="dxa" />
          <w:tcBorders>
            <w:left w:val="single" w:color="${color}" w:sz="24" />
          </w:tcBorders>
          <w:tcMar>
            <w:top w:w="40" w:type="dxa" />
            <w:left w:w="220" w:type="dxa" />
            <w:bottom w:w="40" w:type="dxa" />
          </w:tcMar>
        </w:tcPr>
        ${paragraph(quote.quote, { bold: true, after: 120 })}
      ${paragraph(quote.attribution, { bold: true, size: 11, after: 0 })}
      ${quote.role ? paragraph(quote.role, { size: 11, after: 0 }) : ""}
      </w:tc>
    </w:tr>
  </w:tbl>
  ${spacer()}
`;

const headlineXml = async (
  module: Overview,
  richText: RichText,
  color: string,
  style: "Heading2" | "Heading3" = "Heading3",
) => safeXml`
  <w:tbl>
    ${patterns.headlineTableProperties}
    <w:tblGrid>
      <w:gridCol w:w="10206" />
    </w:tblGrid>
    <w:tr>
      <w:tc>
        ${patterns.headlineCellProperties.replaceAll("93E892", color)}
        ${paragraph(module.heading, {
          style,
          runStyle: insightsHeadlineStyle,
          keepNext: true,
          after: 240,
        })}
        ${await richText.render(module.bodyPortableText)}
        ${module.quote ? quoteXml(module.quote, color) : ""}
      </w:tc>
    </w:tr>
  </w:tbl>
  ${spacer()}
`;

const isContentModule = (module: NationalCurriculumInsightsModule) => {
  switch (module.__typename) {
    case "NationalCurriculumInsightsHeroSection":
    case "NationalCurriculumInsightsHeaderSection":
    case "NationalCurriculumInsightsPhaseCardsSection":
    case "NationalCurriculumInsightsKeyStageCardsSection":
    case "NationalCurriculumInsightsSubjectNavigationSection":
    case "NationalCurriculumInsightsSubjectLinksSection":
    case "NationalCurriculumInsightsNewsletterSection":
    case "NationalCurriculumInsightsDownloadSection":
      return false;
    default:
      return !isClosingModule(module);
  }
};

const videoCardsXml = async (
  module: Extract<
    NationalCurriculumInsightsModule,
    { __typename: "NationalCurriculumInsightsVideoCardsSection" }
  >,
  richText: RichText,
) => {
  let output = sectionHeading(module.heading);
  output += await richText.render(module.introductionPortableText);
  for (const post of module.posts) {
    output += paragraph(post.title, { style: "Heading4", keepNext: true });
    output += paragraph(post.summary);
  }
  return output;
};

const moduleXml = async (
  module: NationalCurriculumInsightsModule,
  richText: RichText,
): Promise<string> => {
  switch (module.__typename) {
    case "NationalCurriculumInsightsOverviewSection":
      return headlineXml(module, richText, "7C9AEC");
    case "NationalCurriculumInsightsChangesSection": {
      let output = sectionHeading(module.heading);
      for (const change of module.changes) {
        output += paragraph(change.title, {
          properties: safeXml`
            <w:pPr>
              <w:pStyle w:val="Heading4" />
              <w:keepNext />
              <w:pBdr>
                <w:bottom
                  w:val="single"
                  w:color="7C9AEC"
                  w:sz="6"
                  w:space="6"
                />
              </w:pBdr>
              <w:spacing w:before="360" w:after="160" />
            </w:pPr>
          `,
        });
        output += paragraph(change.whyItMatters, {
          size: 14,
          after: 120,
          keepNext: true,
        });
        output += await richText.render(change.detailPortableText);
      }
      return output;
    }
    case "NationalCurriculumInsightsUnchangedSection":
    case "NationalCurriculumInsightsRichTextSection":
      return `${sectionHeading(module.heading)}${await richText.render(module.contentPortableText)}`;
    case "NationalCurriculumInsightsChecklistSection": {
      let output = sectionHeading(module.heading);
      for (const item of module.items) {
        output += await richText.render(item.contentPortableText, {
          properties: safeXml`
            <w:pPr>
              <w:keepLines />
              <w:widowControl />
              <w:tabs>
                <w:tab w:val="left" w:pos="680" />
              </w:tabs>
              <w:spacing w:after="200" w:line="300" w:lineRule="auto" />
              <w:ind w:left="680" w:hanging="680" />
            </w:pPr>
          `,
          prefix: `${wordText("☐", { size: 18 })}<w:r><w:tab /></w:r>`,
        });
      }
      return output;
    }
    case "NationalCurriculumInsightsPreparationSection": {
      const estimatedLines = [
        module.heading,
        ...module.steps.map(({ text }) => text),
        module.attribution,
        module.role,
      ].reduce((total, text) => total + estimatePreparationLines(text), 0);
      const keepTogether = estimatedLines <= 24;
      let output = "";
      module.steps.forEach((step, index) => {
        output += safeXml`
          <w:tbl>
            ${patterns.preparationTableProperties}
            <w:tblGrid>
              <w:gridCol w:w="10206" />
            </w:tblGrid>
            <w:tr>
              <w:trPr>
                ${estimatePreparationLines(step.text) <= 24
                  ? safeXml`<w:cantSplit />`
                  : ""}
              </w:trPr>
              <w:tc>
                ${patterns.preparationCellProperties}
              ${paragraph(`${index + 1}.  ${step.text}`, {
                  bold: true,
                  keepNext: true,
                  after: 0,
                })}
              </w:tc>
            </w:tr>
          </w:tbl>
          ${wordParagraph("", { keepNext: true, after: 160 })}
        `;
      });
      return safeXml`
        <w:tbl>
          <w:tblPr>
            <w:tblW w:w="10206" w:type="dxa" />
          </w:tblPr>
          <w:tblGrid>
            <w:gridCol w:w="10206" />
          </w:tblGrid>
          <w:tr>
            <w:trPr>${keepTogether ? safeXml`<w:cantSplit />` : ""}</w:trPr>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="10206" w:type="dxa" />
                <w:tcMar>
                  ${["top", "left", "bottom", "right"].map(
                    (edge) => `<w:${edge} w:w="0" w:type="dxa" />`,
                  )}
                </w:tcMar>
              </w:tcPr>
              ${sectionHeading(module.heading)}
              ${output}
            ${paragraph(module.attribution, {
                bold: true,
                size: 11,
                keepNext: true,
                after: 0,
              })}
            ${paragraph(module.role, { size: 11, after: 160 })}
            </w:tc>
          </w:tr>
        </w:tbl>
        ${spacer()}
      `;
    }
    case "NationalCurriculumInsightsConfidenceSection":
    case "NationalCurriculumInsightsImageTextSection": {
      const cta =
        module.ctaHref && module.ctaLabel
          ? wordParagraph(
              richText.link(
                module.ctaHref,
                wordText(module.ctaLabel, { bold: true }),
              ),
            )
          : "";
      const heading =
        module.__typename === "NationalCurriculumInsightsConfidenceSection"
          ? closingHeading(module.heading)
          : sectionHeading(module.heading);
      return `${heading}${await richText.render(module.bodyPortableText)}${cta}`;
    }
    case "NationalCurriculumInsightsFaqSection": {
      let output = closingHeading(module.heading);
      for (const item of module.items) {
        output += paragraph(item.question, {
          style: "Heading3",
          runStyle: insightsFaqQuestionStyle,
          keepNext: true,
          before: 240,
          after: 120,
        });
        output += await richText.render(item.answerPortableText);
      }
      return output;
    }
    case "NationalCurriculumInsightsGuidanceIntroSection":
      return `${sectionHeading(module.heading)}${await richText.render(module.bodyPortableText)}`;
    case "NationalCurriculumInsightsQuoteSection":
      return quoteXml(module, "93E892");
    case "NationalCurriculumInsightsVideoCardsSection":
      return videoCardsXml(module, richText);
    case "NationalCurriculumInsightsTableSection":
      return (
        sectionHeading(module.heading) +
        safeXml`
          <w:tbl>
            <w:tblPr>
              <w:tblW w:w="10206" w:type="dxa" />
              <w:tblBorders>
                ${["top", "left", "bottom", "right", "insideH", "insideV"].map(
                  (edge) =>
                    `<w:${edge} w:val="single" w:sz="4" w:color="D9D9D9" />`,
                )}
              </w:tblBorders>
              <w:tblCellMar>
                <w:top w:w="100" w:type="dxa" />
                <w:left w:w="120" w:type="dxa" />
                <w:bottom w:w="100" w:type="dxa" />
                <w:right w:w="120" w:type="dxa" />
              </w:tblCellMar>
            </w:tblPr>
            ${module.table.rows.map(
              (row, index) => safeXml`
                <w:tr>
                  ${index === 0
                    ? safeXml`
                        <w:trPr>
                          <w:tblHeader />
                        </w:trPr>
                      `
                    : ""}
              ${row.cells.map(
                    (cell) => safeXml`
                      <w:tc>${paragraph(cell, { bold: index === 0 })}</w:tc>
                    `,
                  )}
                </w:tr>
              `,
            )}
          </w:tbl>
          ${spacer()}
        `
      );
    case "NationalCurriculumInsightsPromotionalHeadingSection":
      return sectionHeading(module.heading);
    default:
      return "";
  }
};

type Entry = { id: number; label: string; content: string; nested?: boolean };

export const buildInsightsDocxContent = async ({
  page,
  stages,
  subjectTitle,
  richText,
  sharedModules = [],
}: {
  page: NationalCurriculumInsightsPage;
  stages: NationalCurriculumInsightsPage["keyStages"];
  subjectTitle: string;
  richText: RichText;
  sharedModules?: NationalCurriculumInsightsModule[];
}) => {
  const overview = getInsightsDocxPhaseHeadlines(page);
  const entries: Entry[] = [];
  let id = 1;
  const addEntry = (label: string, content: string, nested = false) => {
    entries.push({ id: id++, label, content, nested });
  };

  const coverHeadline = await headlineXml(
    overview,
    richText,
    "93E892",
    "Heading2",
  );
  addEntry(`${overview.heading}: ${page.pageType} ${subjectTitle}`, "");

  const addSection = async (
    section: NationalCurriculumInsightsModule,
    nested = false,
  ) => {
    const content = await moduleXml(section, richText);
    const label = contentsLabel(section);
    if (content && label) addEntry(label, content, nested);
  };

  const addPage = async (
    source:
      | NationalCurriculumInsightsPage
      | NationalCurriculumInsightsKeyStagePage,
    label: string,
  ) => {
    const group = wordParagraph(wordText(label), {
      style: "Heading2",
      keepNext: true,
      after: 360,
      properties: safeXml`
        <w:pPr>
          <w:pStyle w:val="Heading2" />
          <w:pageBreakBefore />
          <w:keepNext />
          <w:spacing w:after="360" />
        </w:pPr>
      `,
    });
    addEntry(label, group);
    for (const section of source.modules.filter(isContentModule)) {
      if (source === page && section === overview) continue;
      await addSection(section, true);
    }
  };

  if (stages.length) {
    const phaseContent = page.modules.filter(
      (module) => module !== overview && isContentModule(module),
    );
    for (const section of phaseContent) {
      await addSection(section);
    }
    for (const { keyStage, page: keyStagePage } of stages) {
      await addPage(keyStagePage, `${keyStage} ${subjectTitle}`);
    }
  } else {
    await addPage(
      page,
      `${page.pageType === "primary" ? "Primary" : "Secondary"} ${subjectTitle}`,
    );
  }

  const closing = selectInsightsDocxClosingModules({
    page,
    stages,
    sharedModules,
  });
  for (const section of closing) {
    if ("heading" in section && typeof section.heading === "string")
      addEntry(section.heading, await moduleXml(section, richText));
  }

  const contents = entries
    .map((entry) =>
      wordParagraph(
        safeXml`
          <w:hyperlink w:anchor="insight${entry.id}">
            ${wordText(entry.label, {
              bold: !entry.nested,
              size: entry.nested ? 12 : 14,
            })}
          </w:hyperlink>
        `,
        {
          properties: safeXml`
            <w:pPr>
              ${entry.nested ? safeXml`<w:ind w:left="400" />` : ""}
              <w:spacing w:before="60" w:line="360" />
            </w:pPr>
          `,
        },
      ),
    )
    .join("");

  const body = entries
    .map((entry) => {
      if (!entry.content) return "";
      const bookmarked = entry.content.replace(
        /(<w:p(?:\s[^>]*)?>)(\s*<w:pPr[\s\S]*?<\/w:pPr>)?/,
        `$1$2<w:bookmarkStart w:id="${entry.id}" w:name="insight${entry.id}" /><w:bookmarkEnd w:id="${entry.id}" />`,
      );
      return bookmarked;
    })
    .join("");
  const firstEntry = entries.find((entry) => !entry.content);
  const cover = firstEntry
    ? coverHeadline.replace(
        /(<w:p(?:\s[^>]*)?>)(\s*<w:pPr[\s\S]*?<\/w:pPr>)?/,
        `$1$2<w:bookmarkStart w:id="${firstEntry.id}" w:name="insight${firstEntry.id}" /><w:bookmarkEnd w:id="${firstEntry.id}" />`,
      )
    : coverHeadline;

  return { cover, contents, body };
};
