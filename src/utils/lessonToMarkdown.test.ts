import { lessonToMarkdown } from "./lessonToMarkdown";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";

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
});
