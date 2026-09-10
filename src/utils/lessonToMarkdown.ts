import {
  isStemTextObject,
  type StemObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import type { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

/**
 * Serialises a teacher lesson overview into a deterministic markdown document.
 *
 * "Deterministic" is the contract, not a nice-to-have: the same lesson data
 * must always produce byte-identical markdown. Nothing here may read the clock,
 * the locale, the environment or a random source, and no collection is
 * re-ordered — every list keeps the order the curriculum API returned it in, so
 * the output is stable across requests, regions and deployments.
 *
 * The representation is generated from the curriculum data rather than
 * converted from the rendered HTML. Conversion would inherit the page's
 * presentational structure (nav, cards, accordions, download affordances) and
 * would change shape whenever the page's markup changed; generating from the
 * data means the markdown tracks the curriculum, which is what a consumer
 * actually wants.
 *
 * @see docs/agent-readable-lesson-pages.md for the design and the open
 *   editorial questions about what this document should and should not carry.
 */

const CANONICAL_ORIGIN = "https://www.thenational.academy";

/**
 * Quotes a value for YAML frontmatter. Always double-quotes rather than
 * guessing when quoting is required, so a title containing `:`, `#` or a
 * leading `-` can never break the frontmatter block.
 *
 * YAML 1.2 is a superset of JSON and a double-quoted YAML scalar uses JSON's
 * escaping rules, so `JSON.stringify` is exactly the right quoter here. It also
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
 * Curriculum content is authored for the lesson page, not for a markdown
 * document, and it really does carry markdown's metacharacters. KS3 computing
 * quiz stems include bare HTML tags such as
 * `<link rel="stylesheet" href="styles.css">`, which markdown reads as raw
 * HTML and renders as nothing at all. French and Spanish sound-symbol lessons
 * write their keywords in brackets — `[e]`, `[rr]`, `[qui]`. One PE stem
 * begins `1. `, which opens a nested list, and a Python stem carries a fenced
 * code block whose blank line ends the list item it sits in.
 *
 * Two things happen here. Whitespace collapses first, because every value is
 * emitted on a single line and a raw newline would end the list item or
 * paragraph around it. Then the characters that open an inline construct are
 * backslash-escaped, along with the block markers that matter only at the
 * start of a line — which is where these values sit.
 *
 * Escaping is uniform rather than per-field on purpose. Some of this content
 * was authored as markdown — a few quiz stems use `**bold**`, and science
 * content writes formulae as `$$NO_2$$` — but nothing in the data marks which
 * values those are, and guessing is what leaves the document open to the rest.
 * So every value is treated as text and rendered as the text it is; carrying
 * emphasis or MathJax through faithfully needs the curriculum data to say
 * where they are, which is a separate piece of work.
 *
 * Both steps are pure string transformations, so the determinism contract
 * above still holds.
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
 * Renders a quiz as its question stems only.
 *
 * Correct answers, feedback and hints are all present in the page data
 * (`answerIsCorrect`, `correctChoice`, `correctOrder`) and are deliberately
 * omitted. Oak distributes answer keys as separate, separately gated
 * `*-quiz-answers` downloads; emitting them here would publish an answer key
 * for every lesson as plain text at a URL a pupil can guess from the lesson
 * URL. That is an editorial decision rather than an engineering one, so the
 * conservative option is taken until a content owner rules otherwise.
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

  // `loginRequired` and `geoRestricted` mark lessons whose materials Oak
  // licenses from third parties. This representation deliberately withholds the
  // body for those lessons and points at the page instead.
  //
  // That is STRICTER than the HTML page, which ships the full lesson payload —
  // quiz answers and transcript included — to anonymous visitors inside
  // `__NEXT_DATA__` and restricts only the download and share affordances. The
  // asymmetry is intentional: the fact that the data is already reachable by
  // reading the page's embedded JSON is not a decision to publish it as
  // plain text at a guessable, cacheable URL. Relaxing this is a decision for a
  // content owner, not a default.
  if (lesson.loginRequired || lesson.geoRestricted) {
    return [
      "---",
      ...frontmatter,
      "---",
      "",
      `# ${markdownText(lesson.lessonTitle)}`,
      "",
      "This lesson's materials are restricted, so they are not included in this",
      "markdown representation. Open the lesson page to see what is available.",
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

  // Conditioned on media clips alone, because `hasMediaClips` is precisely what
  // decides whether `/media` exists: that page 404s when the lesson has no
  // clips (`if (!curriculumData || !curriculumData.mediaClips)` in
  // `src/pages/teachers/lessons/[lessonSlug]/media.tsx`). A transcript is NOT
  // that condition — a lesson can carry one without any clips, and
  // `adverbial-complex-sentences` is such a lesson: `hasMediaClips: false`, a
  // populated `transcriptSentences`, and `/media` 404 on production. Linking on
  // transcript presence sent consumers to that 404.
  //
  // The lesson's own transcript stays reachable through the canonical link at
  // the foot of this document, which is where the lesson page renders it.
  //
  // The clip transcripts are linked rather than inlined. Inlining would
  // multiply the size of this document for a minority of consumers, and the
  // video and its clips have their own page; the link keeps the representation
  // bounded.
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
