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
import { flattenNationalCurriculumInsightsModules } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";

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
) => {
  const quoteParagraph = (text: string, options: ParagraphOptions) =>
    paragraph(text, {
      ...options,
      properties: safeXml`
        <w:pPr>
          ${options.keepNext ? safeXml`<w:keepNext />` : ""}
          <w:widowControl />
          <w:pBdr>
            <w:left w:val="single" w:color="${color}" w:sz="24" w:space="11" />
          </w:pBdr>
          <w:spacing
            w:before="0"
            w:after="${options.after ?? 0}"
            w:line="336"
            w:lineRule="auto"
          />
          <w:ind w:left="220" w:right="0" />
        </w:pPr>
      `,
    });
  return (
    quoteParagraph(quote.quote, { bold: true, after: 120, keepNext: true }) +
    quoteParagraph(quote.attribution, {
      bold: true,
      size: 11,
      keepNext: Boolean(quote.role),
    }) +
    (quote.role ? quoteParagraph(quote.role, { size: 11 }) : "") +
    spacer()
  );
};

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
      return module.changes.reduce(
        async (previous, change) => {
          const output = await previous;
          const title = paragraph(change.title, {
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
          const explanation = paragraph(change.whyItMatters, {
            size: 14,
            after: 120,
            keepNext: true,
          });
          return (
            output +
            title +
            explanation +
            (await richText.render(change.detailPortableText))
          );
        },
        Promise.resolve(sectionHeading(module.heading)),
      );
    }
    case "NationalCurriculumInsightsUnchangedSection":
    case "NationalCurriculumInsightsRichTextSection":
      return `${sectionHeading(module.heading)}${await richText.render(module.contentPortableText)}`;
    case "NationalCurriculumInsightsChecklistSection": {
      return module.items.reduce(
        async (previous, item) => {
          const output = await previous;
          return (
            output +
            (await richText.render(item.contentPortableText, {
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
            }))
          );
        },
        Promise.resolve(sectionHeading(module.heading)),
      );
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
                  keepNext: keepTogether,
                  after: 0,
                })}
              </w:tc>
            </w:tr>
          </w:tbl>
          ${wordParagraph("", { keepNext: keepTogether, after: 160 })}
        `;
      });
      return safeXml`
        ${sectionHeading(module.heading)}
        ${output}
        ${paragraph(
          module.attribution,
          {
            bold: true,
            size: 11,
            keepNext: true,
            after: 0,
          },
        )}
        ${paragraph(module.role, {
          size: 11,
          after: 160,
        })}
        ${spacer()}
      `;
    }
    case "NationalCurriculumInsightsConfidenceSection":
    case "NationalCurriculumInsightsImageTextSection": {
      const { ctaHref, ctaLabel } =
        module.__typename === "NationalCurriculumInsightsConfidenceSection"
          ? { ctaHref: getLinkHref(module.cta), ctaLabel: module.cta.label }
          : module;
      const cta =
        ctaHref && ctaLabel
          ? wordParagraph(
              richText.link(ctaHref, wordText(ctaLabel, { bold: true })),
            )
          : "";
      const heading =
        module.__typename === "NationalCurriculumInsightsConfidenceSection"
          ? closingHeading(module.heading)
          : sectionHeading(module.heading);
      return `${heading}${await richText.render(module.bodyPortableText)}${cta}`;
    }
    case "NationalCurriculumInsightsFaqSection": {
      return module.items.reduce(
        async (previous, item) => {
          const output = await previous;
          const question = paragraph(item.question, {
            style: "Heading3",
            runStyle: insightsFaqQuestionStyle,
            keepNext: true,
            before: 240,
            after: 120,
          });
          return (
            output + question + (await richText.render(item.answerPortableText))
          );
        },
        Promise.resolve(closingHeading(module.heading)),
      );
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
    await flattenNationalCurriculumInsightsModules(source.modules)
      .filter(isContentModule)
      .reduce(async (previous, section) => {
        await previous;
        if (source === page && section === overview) return;
        await addSection(section, true);
      }, Promise.resolve());
  };

  if (stages.length) {
    const phaseContent = flattenNationalCurriculumInsightsModules(
      page.modules,
    ).filter((module) => module !== overview && isContentModule(module));
    await phaseContent.reduce(async (previous, section) => {
      await previous;
      await addSection(section);
    }, Promise.resolve());
    await stages.reduce(async (previous, { keyStage, page: keyStagePage }) => {
      await previous;
      await addPage(keyStagePage, `${keyStage} ${subjectTitle}`);
    }, Promise.resolve());
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
  await closing.reduce(async (previous, section) => {
    await previous;
    if ("heading" in section && typeof section.heading === "string")
      addEntry(section.heading, await moduleXml(section, richText));
  }, Promise.resolve());

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
