import {
  isStemTextObject,
  type StemObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import type { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

/**
 * Serialises a teacher lesson overview into a deterministic markdown document.
 *
 * "Deterministic" is the contract: the same lesson data must always produce
 * byte-identical markdown, so nothing here may read the clock, the locale, the
 * environment or a random source, and no collection is re-ordered.
 *
 * @see docs/agent-readable-lesson-pages.md for why the document is generated
 *   from the curriculum data rather than converted from the rendered page, what
 *   it contains, and the open editorial questions.
 */

const CANONICAL_ORIGIN = "https://www.thenational.academy";

/**
 * Quotes a value for YAML frontmatter. A double-quoted YAML scalar uses JSON's
 * escaping rules, so `JSON.stringify` is exactly the right quoter — it also
 * escapes newlines and control characters, which a hand-rolled quote-and-
 * backslash replacement would let through into the frontmatter block.
 */
function yamlValue(value: string): string {
  return JSON.stringify(value);
}

/**
 * Escapes a curriculum value so it reaches the reader as the text the
 * curriculum holds rather than as markdown syntax.
 *
 * Whitespace collapses first, because every value is emitted on a single line
 * and a raw newline would end the list item or paragraph around it. Escaping is
 * uniform rather than per-field: nothing in the data marks which values were
 * authored as markdown, and guessing is what leaves the document open to the
 * rest.
 *
 * @see docs/agent-readable-lesson-pages.md, "Curriculum values are escaped",
 *   for the production content that made each step necessary.
 */
function markdownText(value: string): string {
  return (
    value
      // Only whitespace that would end the block is collapsed, along with
      // runs of ordinary spaces. A non-breaking or narrow space is text the
      // curriculum holds — French punctuation spacing uses one — so `\s` is
      // deliberately not used here, and nor is `trim`.
      .replace(/[ \r\n\t\f\v\u2028\u2029]+/g, " ")
      .replace(/^ | $/g, "")
      // Backslash first: escaping it afterwards would escape the backslashes
      // the steps below add.
      .replace(/\\/g, String.raw`\\`)
      // Emphasis, code spans, links and images, raw HTML, entity references,
      // strikethrough and table cells.
      .replace(/[*_`[\]<>&~|]/g, String.raw`\$&`)
      // Block markers, which bite only where the value begins a line — a
      // heading, a bullet, or a setext underline. Each needs the delimiter
      // that follows it, so `#tag` and `-ish` are left alone.
      .replace(/^(#{1,6}|[-+])(?=\s|$)/, String.raw`\$&`)
      // A run of dashes, spaced or not, is a thematic break, and a lone "="
      // underlines the line above it.
      .replace(/^([-=])(?=[-= ]*$)/, String.raw`\$&`)
      // A leading number opens an ordered list. The digits cannot be escaped,
      // so the delimiter after them is — and only when it really is one, which
      // leaves a decimal such as "0.25" as it was written.
      .replace(/^(\d{1,9})([.)])(?=\s|$)/, String.raw`$1\$2`)
  );
}

/**
 * Renders a quiz question stem or answer part. Image parts carry no alt text in
 * the curriculum data, so they are rendered as a labelled placeholder rather
 * than as a markdown image with an empty alt attribute.
 */
function renderStem(parts: StemObject[]): string {
  return markdownText(
    parts
      .map((part) => (isStemTextObject(part) ? part.text : "[image]"))
      .join(" "),
  );
}

/**
 * A markdown section: a heading plus its lines. Sections with no lines are
 * dropped entirely, so a lesson without misconceptions has no empty
 * "Common misconceptions" heading.
 */
type Section = { heading: string; lines: string[] };

/**
 * Renders a quiz as its question stems only. Correct answers, feedback and
 * hints are present in the page data and are deliberately omitted — Oak
 * distributes answer keys as separately gated `*-quiz-answers` downloads.
 *
 * @see docs/agent-readable-lesson-pages.md, "Deliberate omissions".
 */
function quizSection(
  heading: string,
  quiz: LessonOverviewPageData["starterQuiz"],
): Section {
  // Every question is rendered, matching the lesson page — nothing in the app
  // filters on the `active` flag, so this must not either.
  const lines = (quiz ?? []).map((question, index) => {
    // The question type is included because it tells a consumer how the
    // question is meant to be answered, which the stem alone does not.
    const stem = renderStem(question.questionStem);
    return `${index + 1}. ${stem} _(${question.questionType})_`;
  });

  return { heading, lines };
}

export function lessonToMarkdown(lesson: LessonOverviewPageData): string {
  // The slug lands in a link destination, which ends at the first space or
  // bracket, so it is encoded rather than escaped.
  const canonicalUrl = `${CANONICAL_ORIGIN}/teachers/lessons/${encodeURIComponent(
    lesson.lessonSlug,
  )}`;

  // Frontmatter carries the identity and the handling flags. A consumer that
  // only reads the frontmatter must still learn that a lesson is restricted,
  // expired, or excluded from teaching-materials reuse.
  const frontmatter: string[] = [
    `title: ${yamlValue(lesson.lessonTitle)}`,
    `lesson-slug: ${yamlValue(lesson.lessonSlug)}`,
    `canonical-url: ${yamlValue(canonicalUrl)}`,
    `subject: ${yamlValue(lesson.subjectTitle)}`,
    `key-stage: ${yamlValue(lesson.keyStageTitle)}`,
    `unit: ${yamlValue(lesson.unitTitle)}`,
  ];

  if (lesson.yearTitle) {
    frontmatter.push(`year: ${yamlValue(lesson.yearTitle)}`);
  }
  if (lesson.examBoardTitle) {
    frontmatter.push(`exam-board: ${yamlValue(lesson.examBoardTitle)}`);
  }
  if (lesson.tierTitle) {
    frontmatter.push(`tier: ${yamlValue(lesson.tierTitle)}`);
  }
  if (lesson.lessonReleaseDate) {
    frontmatter.push(
      `lesson-release-date: ${yamlValue(lesson.lessonReleaseDate)}`,
    );
  }

  frontmatter.push(
    `login-required: ${lesson.loginRequired}`,
    `geo-restricted: ${lesson.geoRestricted}`,
    `expired: ${Boolean(lesson.expired)}`,
    `excluded-from-teaching-materials: ${lesson.excludedFromTeachingMaterials}`,
    `licence: ${yamlValue("https://www.thenational.academy/legal/terms-and-conditions")}`,
  );

  // Three flags withhold the body: two third-party licensing flags plus
  // `excludedFromTeachingMaterials`, Oak's own not-for-reuse signal. This is
  // deliberately stricter than the lesson page, which ships the full payload in
  // `__NEXT_DATA__` — see docs/agent-readable-lesson-pages.md, "Deliberate
  // omissions", before relaxing it.
  if (
    lesson.loginRequired ||
    lesson.geoRestricted ||
    lesson.excludedFromTeachingMaterials
  ) {
    return [
      "---",
      ...frontmatter,
      "---",
      "",
      `# ${markdownText(lesson.lessonTitle)}`,
      "",
      "This lesson's materials are restricted or excluded from reuse, so they",
      "are not included in this markdown representation. The frontmatter above",
      "records which restriction applies. Open the lesson page to see what is",
      "available.",
      "",
      `[View this lesson on Oak National Academy](${canonicalUrl})`,
      "",
    ].join("\n");
  }

  const sections: Section[] = [
    {
      heading: "Lesson outcome",
      lines: lesson.pupilLessonOutcome
        ? [markdownText(lesson.pupilLessonOutcome)]
        : [],
    },
    {
      heading: "Content guidance",
      lines: (lesson.contentGuidance ?? []).map(
        (guidance) =>
          `- **${markdownText(guidance.contentGuidanceLabel)}** — ${markdownText(
            guidance.contentGuidanceDescription,
          )}`,
      ),
    },
    {
      heading: "Key learning points",
      lines: (lesson.keyLearningPoints ?? [])
        .map((point) => point.keyLearningPoint)
        .filter((point): point is string => Boolean(point))
        .map((point) => `- ${markdownText(point)}`),
    },
    {
      heading: "Lesson outline",
      lines: (lesson.lessonOutline ?? []).map(
        (item, index) => `${index + 1}. ${markdownText(item.lessonOutline)}`,
      ),
    },
    {
      heading: "Keywords",
      lines: (lesson.lessonKeywords ?? [])
        .filter((entry) => entry.keyword.trim())
        .map(
          (entry) =>
            `- **${markdownText(entry.keyword)}** — ${markdownText(entry.description)}`,
        ),
    },
    {
      heading: "Common misconceptions",
      lines: (lesson.misconceptionsAndCommonMistakes ?? [])
        .filter((entry) => entry.misconception.trim())
        .map(
          (entry) =>
            `- **${markdownText(entry.misconception)}** — ${markdownText(
              entry.response,
            )}`,
        ),
    },
    {
      heading: "Teacher tips",
      lines: (lesson.teacherTips ?? [])
        .filter((entry) => entry.teacherTip.trim())
        .map((entry) => `- ${markdownText(entry.teacherTip)}`),
    },
    {
      heading: "Equipment and resources",
      lines: (lesson.lessonEquipmentAndResources ?? [])
        .filter((entry) => entry.equipment.trim())
        .map((entry) => `- ${markdownText(entry.equipment)}`),
    },
    quizSection("Starter quiz", lesson.starterQuiz),
    quizSection("Exit quiz", lesson.exitQuiz),
  ];

  // Conditioned on clips alone: `/media` 404s when a lesson has none, and a
  // lesson can carry a transcript without any clips. The clip transcripts are
  // linked rather than inlined to keep the document bounded; the lesson's own
  // transcript stays reachable through the canonical link at the foot.
  if (lesson.hasMediaClips) {
    sections.push({
      heading: "Video and transcript",
      lines: [`- [Lesson video and transcript](${canonicalUrl}/media)`],
    });
  }

  const availableDownloads = (lesson.downloads ?? []).filter(
    (download) => download.exists,
  );
  if (availableDownloads.length > 0) {
    sections.push({
      heading: "Downloads available",
      lines: availableDownloads.map((download) => `- ${download.type}`),
    });
  }

  const copyrightLines = (lesson.legacyCopyrightContent ?? []).map(
    (entry) => `- ${markdownText(entry.copyrightInfo)}`,
  );
  if (copyrightLines.length > 0) {
    sections.push({ heading: "Copyright", lines: copyrightLines });
  }

  const body = sections
    .filter((section) => section.lines.length > 0)
    .map((section) => `## ${section.heading}\n\n${section.lines.join("\n")}`);

  return [
    "---",
    ...frontmatter,
    "---",
    "",
    `# ${markdownText(lesson.lessonTitle)}`,
    "",
    ...body.flatMap((section) => [section, ""]),
    `[View this lesson on Oak National Academy](${canonicalUrl})`,
    "",
  ].join("\n");
}
