import { lessonToMarkdown } from "./lessonToMarkdown";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import type { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";

/**
 * A one-question multiple-choice quiz with the given stem text. The question
 * type is pinned rather than inherited, because the assertions below read it
 * back out of the document.
 */
const quizWithStem = (text: string): NonNullable<LessonOverviewQuizData> =>
  quizQuestions.slice(0, 1).map((question) => ({
    ...question,
    questionType: "multiple-choice",
    questionStem: [{ type: "text", text }],
  }));

/**
 * Reverses backslash escaping, whatever scheme produced it.
 *
 * The assertions below pair an exact byte expectation with a round-trip
 * through this, so they say what the document must mean as well as what it
 * must say. The byte expectation matters because this document is consumed
 * raw; the round-trip holds under any escaping scheme, so a different but
 * correct one would still pass, and a scheme that mangles the text — escaping
 * backslashes last, say, which doubles every escape — would not.
 */
const deEscape = (markdown: string): string => markdown.replace(/\\(.)/g, "$1");

/** The document below its frontmatter, which has its own quoter. */
const bodyOf = (markdown: string): string =>
  markdown.slice(markdown.indexOf("\n---\n") + "\n---\n".length);

describe("lessonToMarkdown()", () => {
  it("is deterministic — the same lesson always produces byte-identical markdown", () => {
    const lesson = lessonOverviewFixture();

    expect(lessonToMarkdown(lesson)).toBe(lessonToMarkdown(lesson));
    expect(lessonToMarkdown(lessonOverviewFixture())).toBe(
      lessonToMarkdown(lessonOverviewFixture()),
    );
  });

  it("opens with YAML frontmatter carrying the lesson's identity", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        lessonSlug: "adverbial-complex-sentences",
        lessonTitle: "Adverbial complex sentences",
      }),
    );

    expect(markdown.startsWith("---\n")).toBe(true);
    expect(markdown).toContain('title: "Adverbial complex sentences"');
    expect(markdown).toContain('lesson-slug: "adverbial-complex-sentences"');
    expect(markdown).toContain(
      'canonical-url: "https://www.thenational.academy/teachers/lessons/adverbial-complex-sentences"',
    );
  });

  it("carries the handling flags a consumer needs, even when false", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        loginRequired: false,
        geoRestricted: false,
        expired: false,
        excludedFromTeachingMaterials: false,
      }),
    );

    expect(markdown).toContain("login-required: false");
    expect(markdown).toContain("geo-restricted: false");
    expect(markdown).toContain("expired: false");
    expect(markdown).toContain("excluded-from-teaching-materials: false");
  });

  it("escapes frontmatter values so a title cannot break the block", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        lessonTitle: 'Punctuation: the "colon" and \\ the backslash',
      }),
    );

    expect(markdown).toContain(
      'title: "Punctuation: the \\"colon\\" and \\\\ the backslash"',
    );
  });

  it("escapes a newline in a frontmatter value rather than breaking the block", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ lessonTitle: "Line one\nline two" }),
    );

    // The frontmatter block must stay exactly two `---` lines: a raw newline
    // here would end it early and turn the rest into body text.
    const frontmatter = markdown.split("---")[1];

    expect(markdown).toContain('title: "Line one\\nline two"');
    expect(frontmatter).not.toContain("line two\n");
    expect(markdown.split("\n").filter((l) => l === "---")).toHaveLength(2);
  });

  it("renders the lesson's teaching content as markdown sections", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        pupilLessonOutcome: "You can identify an adverbial complex sentence.",
        keyLearningPoints: [{ keyLearningPoint: "A main clause makes sense." }],
        lessonKeywords: [
          { keyword: "clause", description: "a group of words" },
        ],
        misconceptionsAndCommonMistakes: [
          { misconception: "All clauses are sentences", response: "They fail" },
        ],
        teacherTips: [{ teacherTip: "Model the sentence aloud" }],
        lessonEquipmentAndResources: [{ equipment: "Whiteboard" }],
      }),
    );

    expect(markdown).toContain("# Adverbial complex sentences");
    expect(markdown).toContain("## Lesson outcome");
    expect(markdown).toContain(
      "You can identify an adverbial complex sentence.",
    );
    expect(markdown).toContain("## Key learning points\n\n- A main clause");
    expect(markdown).toContain("- **clause** — a group of words");
    expect(markdown).toContain("- **All clauses are sentences** — They fail");
    expect(markdown).toContain("## Teacher tips\n\n- Model the sentence aloud");
    expect(markdown).toContain("## Equipment and resources\n\n- Whiteboard");
  });

  it("omits sections the lesson has no content for", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        teacherTips: null,
        lessonEquipmentAndResources: null,
        misconceptionsAndCommonMistakes: null,
        contentGuidance: null,
      }),
    );

    expect(markdown).not.toContain("## Teacher tips");
    expect(markdown).not.toContain("## Equipment and resources");
    expect(markdown).not.toContain("## Common misconceptions");
    expect(markdown).not.toContain("## Content guidance");
  });

  it("renders quiz question stems but never the correct answers", () => {
    const markdown = lessonToMarkdown(lessonOverviewFixture());

    expect(markdown).toContain("## Starter quiz");
    expect(markdown).toContain("## Exit quiz");

    // Assert against the quiz sections specifically. Some answer text is also
    // legitimate keyword-description text elsewhere in the document, so a
    // whole-document search would fail for the wrong reason.
    const quizzes = markdown
      .split("## Starter quiz")[1]
      ?.split("## Video and transcript")[0];

    expect(quizzes).toBeDefined();
    expect(quizzes).toContain("What is a main clause? _(multiple-choice)_");
    expect(quizzes).toContain("_(match)_");
    expect(quizzes).toContain("_(order)_");

    // The fixture's multiple-choice answer marked `answerIsCorrect: true`, the
    // match question's `correctChoice`, and the ordering answers must all be
    // absent — see the rationale on quizSection().
    expect(quizzes).not.toContain(
      "a group of words that contains a verb and makes complete sense",
    );
    expect(quizzes).not.toContain("Trees grow from seeds.");
    expect(quizzes).not.toContain("producer");
    expect(quizzes).not.toContain("Edward the Confessor died.");
    expect(quizzes).not.toContain("answerIsCorrect");
    expect(quizzes).not.toContain("correctOrder");
  });

  it("withholds the body for a login-required lesson", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ loginRequired: true, geoRestricted: false }),
    );

    expect(markdown).toContain("login-required: true");
    expect(markdown).toContain("restricted");
    expect(markdown).not.toContain("## Key learning points");
    expect(markdown).not.toContain("## Starter quiz");
    expect(markdown).toContain(
      "[View this lesson on Oak National Academy](https://www.thenational.academy/teachers/lessons/",
    );
  });

  it("withholds the body for a geo-restricted lesson", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ loginRequired: false, geoRestricted: true }),
    );

    expect(markdown).toContain("geo-restricted: true");
    expect(markdown).not.toContain("## Key learning points");
    expect(markdown).not.toContain("## Starter quiz");
  });

  it("links the video and transcript rather than inlining them", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        transcriptSentences: ["this is a sentence", "and another"],
      }),
    );

    expect(markdown).toContain("## Video and transcript");
    expect(markdown).toContain("/media)");
    expect(markdown).not.toContain("this is a sentence");
  });

  it("lists the downloads that exist and not the ones that do not", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        downloads: [
          { exists: true, type: "presentation" },
          { exists: false, type: "worksheet-pdf" },
        ],
      }),
    );

    expect(markdown).toContain("## Downloads available\n\n- presentation");
    expect(markdown).not.toContain("worksheet-pdf");
  });

  it("ends with a link back to the canonical lesson page", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ lessonSlug: "photosynthesis" }),
    );

    expect(
      markdown
        .trimEnd()
        .endsWith(
          "[View this lesson on Oak National Academy](https://www.thenational.academy/teachers/lessons/photosynthesis)",
        ),
    ).toBe(true);
  });

  it("escapes markdown syntax in the lesson title so the heading reads as the title", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ lessonTitle: "Using * and _ in [brackets]" }),
    );

    expect(markdown).toContain("# Using \\* and \\_ in \\[brackets\\]");
    expect(deEscape(markdown)).toContain("# Using * and _ in [brackets]");
  });

  it("escapes a keyword written in brackets, as the languages lessons write it", () => {
    // Real content: French and Spanish sound-symbol lessons name the sound in
    // brackets, e.g. the keyword "[e]" in french-secondary-ks3 /
    // what-is-that-cest-and-singular-indefinite-articles.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        lessonKeywords: [{ keyword: "[e]", description: "sounds like 'je'" }],
      }),
    );

    expect(markdown).toContain("- **\\[e\\]** — sounds like 'je'");
    expect(deEscape(markdown)).toContain("- **[e]** — sounds like 'je'");
  });

  it("escapes brackets in a key learning point", () => {
    // Real content from computing-secondary-ks3 / creating-lists-in-python.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        keyLearningPoints: [
          { keyLearningPoint: "The first item is stored at index [0]." },
        ],
      }),
    );

    expect(markdown).toContain("- The first item is stored at index \\[0\\].");
    expect(deEscape(markdown)).toContain(
      "- The first item is stored at index [0].",
    );
  });

  it("escapes an HTML tag in a quiz stem so the question still reaches the reader", () => {
    // Real content from computing-secondary-ks3 / introduction-to-css. A bare
    // tag is raw HTML in markdown, so the question text renders as nothing.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        starterQuiz: quizWithStem('<link rel="stylesheet" href="styles.css">'),
      }),
    );

    expect(markdown).toContain(
      '1. \\<link rel="stylesheet" href="styles.css"\\> _(multiple-choice)_',
    );
    expect(deEscape(markdown)).toContain(
      '1. <link rel="stylesheet" href="styles.css"> _(multiple-choice)_',
    );
  });

  it("escapes a quiz stem that carries its own number, so it stays one question", () => {
    // Real content from physical-education-secondary-ks3 /
    // maintain-possession-with-keep-ball.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        starterQuiz: quizWithStem("1. What is it called when you attack?"),
      }),
    );

    expect(markdown).toContain("1. 1\\. What is it called when you attack?");
    expect(deEscape(markdown)).toContain(
      "1. 1. What is it called when you attack?",
    );
  });

  it("escapes a quiz stem that starts with a comparison operator", () => {
    // Real content from computing-secondary-ks3 /
    // building-a-program-using-control-structures. Unescaped, ">=" opens a
    // block quote and the ">" is lost.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ starterQuiz: quizWithStem(">=") }),
    );

    expect(markdown).toContain("1. \\>= _(multiple-choice)_");
    expect(deEscape(markdown)).toContain("1. >= _(multiple-choice)_");
  });

  it("keeps a multi-line quiz stem on one line so the list survives it", () => {
    // Real content from computing-secondary-ks3 / creating-lists-in-python:
    // the stem carries a fenced code block, and its blank line would end the
    // list item and swallow the rest of the document.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        starterQuiz: quizWithStem(
          'What does this print?\n\n```days = ["Monday"]\nprint(days[0])```',
        ),
      }),
    );

    expect(markdown).toContain(
      '1. What does this print? \\`\\`\\`days = \\["Monday"\\] print(days\\[0\\])\\`\\`\\` _(multiple-choice)_',
    );
    expect(deEscape(markdown)).toContain(
      '1. What does this print? ```days = ["Monday"] print(days[0])``` _(multiple-choice)_',
    );
  });

  it("escapes every curriculum value in the body, whichever section carries it", () => {
    // The body is assembled from a dozen separate emitters, and the defect
    // being guarded against is one of them forgetting to escape. Rather than
    // name them, put the same syntax through every field and require that none
    // of it reaches the body unescaped. Frontmatter is excluded because it has
    // its own quoter.
    const sentinel = "*_`[]<>&~|";
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        lessonTitle: sentinel,
        pupilLessonOutcome: sentinel,
        contentGuidance: [
          {
            contentGuidanceLabel: sentinel,
            contentGuidanceDescription: sentinel,
            contentGuidanceArea: "area",
          },
        ],
        keyLearningPoints: [{ keyLearningPoint: sentinel }],
        lessonOutline: [{ lessonOutline: sentinel }],
        lessonKeywords: [{ keyword: sentinel, description: sentinel }],
        misconceptionsAndCommonMistakes: [
          { misconception: sentinel, response: sentinel },
        ],
        teacherTips: [{ teacherTip: sentinel }],
        lessonEquipmentAndResources: [{ equipment: sentinel }],
        legacyCopyrightContent: [{ copyrightInfo: sentinel }],
        starterQuiz: quizWithStem(sentinel),
        exitQuiz: quizWithStem(sentinel),
      }),
    );

    const body = bodyOf(markdown);

    expect(body).toContain("Keywords");
    expect(body).not.toContain(sentinel);
    expect(deEscape(body)).toContain(sentinel);
  });

  it("escapes the title of a restricted lesson, which takes its own branch", () => {
    const sentinel = "*_`[]<>&~|";
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ loginRequired: true, lessonTitle: sentinel }),
    );

    expect(bodyOf(markdown)).not.toContain(sentinel);
    expect(deEscape(markdown)).toContain(`# ${sentinel}`);
  });

  it("leaves a decimal alone, because it is not an ordered list", () => {
    // A leading number only opens a list when a space follows the dot, so
    // maths and science values must survive untouched.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        keyLearningPoints: [{ keyLearningPoint: "0.25 of the total" }],
        lessonKeywords: [
          { keyword: "0.50 mol/dm3", description: "a concentration" },
        ],
      }),
    );

    expect(markdown).toContain("- 0.25 of the total");
    expect(markdown).toContain("- **0.50 mol/dm3** — a concentration");
  });

  it("leaves ordinary punctuation alone rather than escaping the whole value", () => {
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        keyLearningPoints: [
          { keyLearningPoint: "Water (H2O) freezes at 0°C; ice floats." },
        ],
      }),
    );

    expect(markdown).toContain("- Water (H2O) freezes at 0°C; ice floats.");
  });

  it("escapes a backslash before the syntax around it, not after", () => {
    // Real content: KS3 computing writes Windows paths. Escaping backslashes
    // last would double every escape this function adds, so "a*b" would come
    // out as "a\\*b" and render with a stray backslash.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        keyLearningPoints: [
          { keyLearningPoint: "Files live under C:\\Users\\pupil, not *here*" },
        ],
      }),
    );

    expect(markdown).toContain(
      "- Files live under C:\\\\Users\\\\pupil, not \\*here\\*",
    );
    expect(deEscape(markdown)).toContain(
      "- Files live under C:\\Users\\pupil, not *here*",
    );
  });

  it.each(["-- --", "--- ---", "----- -", "---", "- - -"])(
    "keeps %j as text rather than letting it become a horizontal rule",
    (value) => {
      // A thematic break is three or more dashes with any spacing between
      // them, so a dash run has to be escaped whether or not it is contiguous.
      // The lesson outcome is the one value emitted on a bare line, which is
      // where a thematic break can form.
      const markdown = lessonToMarkdown(
        lessonOverviewFixture({ pupilLessonOutcome: value }),
      );

      const line = bodyOf(markdown)
        .split("\n")
        .find((l) => deEscape(l) === value);

      expect(line).toBeDefined();
      expect(line).not.toBe(value);
    },
  );

  it("keeps a non-breaking space, which is text and not layout", () => {
    // French punctuation spacing uses U+202F, and the curriculum holds it. Only
    // whitespace that would end the block needs collapsing.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({
        keyLearningPoints: [{ keyLearningPoint: "Qu'est-ce que c'est\u202F?" }],
      }),
    );

    expect(markdown).toContain("- Qu'est-ce que c'est\u202F?");
  });

  it("encodes the lesson slug into the link, which is a URL and not text", () => {
    // The slug's only contract is z.string(), and a markdown link destination
    // ends at the first space or bracket.
    const markdown = lessonToMarkdown(
      lessonOverviewFixture({ lessonSlug: "a (b) c" }),
    );

    expect(markdown).toContain(
      "[View this lesson on Oak National Academy](https://www.thenational.academy/teachers/lessons/a%20(b)%20c)",
    );
  });
});
