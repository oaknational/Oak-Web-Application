import JSZip from "jszip";

import { swimmingLessonGuideDocumentXml } from "./swimmingLessonGuide.fixture";

import {
  lessonGuideDocxToHtml,
  lessonGuideXmlToHtml,
  renderStandaloneHtml,
} from ".";

const RELATIONSHIP_TYPES =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

const relationshipsXml = (
  relationships: { id: string; target: string; type: "hyperlink" | "image" }[],
) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${relationships
  .map(
    ({ id, target, type }) =>
      `<Relationship Id="${id}" Type="${RELATIONSHIP_TYPES}/${type}" Target="${target}"${type === "hyperlink" ? ` TargetMode="External"` : ""}/>`,
  )
  .join("\n")}
</Relationships>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:numFmt w:val="bullet"/></w:lvl></w:abstractNum>
  <w:abstractNum w:abstractNumId="1"><w:lvl w:ilvl="0"><w:numFmt w:val="decimal"/></w:lvl></w:abstractNum>
  ${[1, 2, 3, 4, 5, 6, 7, 8]
    .map((id) => `<w:num w:numId="${id}"><w:abstractNumId w:val="0"/></w:num>`)
    .join("")}
  <w:num w:numId="9"><w:abstractNumId w:val="1"/></w:num>
</w:numbering>`;

const render = (html: string) => {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container;
};

const outline = (container: HTMLElement) =>
  [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].map(
    (heading) => `${heading.tagName.toLowerCase()} ${heading.textContent}`,
  );

const findHeading = (container: HTMLElement, text: string) => {
  const heading = [...container.querySelectorAll("h2, h3")].find(
    (el) => el.textContent === text,
  );
  if (!heading) throw new Error(`No heading "${text}"`);
  return heading;
};

/** The text between a heading and the next heading. */
const sectionText = (container: HTMLElement, headingText: string) => {
  const text: string[] = [];
  let el = findHeading(container, headingText).nextElementSibling;
  while (el && !/^H\d$/.test(el.tagName)) {
    text.push(el.textContent ?? "");
    el = el.nextElementSibling;
  }
  return text.join("\n");
};

const paragraphStartingWith = (container: HTMLElement, start: string) =>
  [...container.querySelectorAll("p")].find((p) =>
    p.textContent?.startsWith(start),
  );

describe("lessonGuideXmlToHtml", () => {
  const { html, warnings } = lessonGuideXmlToHtml({
    documentXml: swimmingLessonGuideDocumentXml,
  });
  const container = render(html);

  it("reads the landscape layout as one outline", () => {
    expect(outline(container)).toEqual([
      "h2 Lesson outcome",
      "h2 Key learning points",
      "h2 Keywords",
      "h2 Equipment",
      "h2 Demo videos",
      "h2 Further guidance",
      "h2 Risk assessment",
      "h2 Starter quiz",
      "h2 Warm up",
      "h2 Preparing for the first lesson",
      "h3 Explanation",
      "h3 Check for understanding",
      "h3 Practice’ Equipment corners’",
      "h3 Feedback",
      "h3 Adapt",
      "h2 Expectations and ground rules",
      "h3 Explanation",
      "h3 Check for understanding",
      "h3 Practice ‘Whistle code game’",
      "h3 Feedback",
      "h3 Adapt",
      "h2 Entries, exits and regaining standing",
      "h3 Explanation",
      "h3 Check for understanding",
      "h3 Practice - ‘Circuit’",
      "h3 Feedback",
      "h3 Adapt",
      "h2 Cool down",
      "h2 Exit quiz",
    ]);
  });

  it("keeps quiz questions under their own heading", () => {
    const starterQuiz = sectionText(container, "Starter quiz");
    expect(starterQuiz).toContain("1. Who has been swimming before?");
    expect(starterQuiz).toContain(
      "4. Why is it important to listen carefully to the swimming teacher and follow instructions?",
    );
    expect(starterQuiz).not.toContain("Use the warm up");

    expect(sectionText(container, "Warm up")).toMatch(
      /^Use the warm up to check pupils’ prior knowledge/,
    );
  });

  it("nests list items that are only indented further", () => {
    const circuit = findHeading(container, "Practice - ‘Circuit’")
      .nextElementSibling as HTMLElement;
    const steps = circuit.querySelectorAll(":scope > li");
    const subSteps = (index: number) =>
      [
        ...circuit.querySelectorAll(
          `:scope > li:nth-child(${index}) > ul > li`,
        ),
      ].map((li) => li.textContent);

    expect(circuit.tagName).toBe("UL");
    expect(steps).toHaveLength(4);
    expect(subSteps(2)).toEqual(["safe entry", "safe exit", "kicking"]);
    expect(subSteps(4)).toEqual([
      "starting in a press up position pupils bend their knees under their chest",
      "lift their head",
      "pull back with their hands",
      "stand up",
    ]);
  });

  it("keeps the spaces Word stores in runs of their own", () => {
    expect(paragraphStartingWith(container, "Refer to")?.textContent).toBe(
      "Refer to the C-STEP principles for lesson adaptations.",
    );
  });

  it("joins words split across runs and ignores bold paragraph marks", () => {
    expect(paragraphStartingWith(container, "I can explain")?.innerHTML).toBe(
      "I can explain the whistle code and demonstrate safe entries and exits, how to regain footing to understand ground rules and key safety information before my first swimming lesson.",
    );
  });

  it("keeps bold keywords, but not bold headings", () => {
    expect(paragraphStartingWith(container, "entry")?.innerHTML).toBe(
      "<strong>entry</strong>: a method of carefully and safely getting into the pool",
    );
    expect(paragraphStartingWith(container, "Some of us")?.innerHTML).toContain(
      "what to <strong>expect</strong> in our first lesson",
    );
    expect(findHeading(container, "Keywords").innerHTML).toBe("Keywords");
  });

  it("gives screen readers words for answer and adapt symbols", () => {
    expect(paragraphStartingWith(container, "A. towel")?.innerHTML).toBe(
      'A. towel <strong><span aria-hidden="true">✓</span><span class="visually-hidden">(correct answer)</span></strong>   B. wet wipes   C. water bottle',
    );
    expect(paragraphStartingWith(container, "↓")?.innerHTML).toBe(
      '<strong><span aria-hidden="true">↓</span><span class="visually-hidden">Easier:</span></strong> pupils move to the items walking in their normal manner',
    );
  });

  it("leaves out spacer paragraphs, empty headings and the coloured stripes", () => {
    expect(
      container.querySelectorAll("p:empty, h2:empty, h3:empty"),
    ).toHaveLength(0);
    expect(container.querySelectorAll("table")).toHaveLength(0);
  });

  it("reports what it couldn't convert", () => {
    expect(warnings).toEqual(
      expect.arrayContaining([
        'Image "image9.png" has no alt text, so it was treated as decorative and left out.',
        'The link "C-STEP principles" has no target in the relationships (word/_rels/document.xml.rels), so it\'s shown without a link.',
        "Some list types couldn't be found in the numbering definitions (word/numbering.xml), so those lists are shown as bulleted lists.",
        'Image "image5.png" (alt text "Click on this video icon to open the lesson\'s media page which, includes a video demonstration for the warm up activity.") couldn\'t be loaded, so it was left out.',
      ]),
    );
  });

  it("links to safe targets from the relationships", () => {
    const result = lessonGuideXmlToHtml({
      documentXml: swimmingLessonGuideDocumentXml,
      relationshipsXml: relationshipsXml([
        { id: "rId10", target: "https://oak.link/swi-3hsg", type: "hyperlink" },
        {
          id: "rId12",
          target: "https://example.com/c-step",
          type: "hyperlink",
        },
        { id: "rId14", target: "javascript:alert(1)", type: "hyperlink" },
        {
          id: "rId16",
          target: "https://example.com/quizzes",
          type: "hyperlink",
        },
      ]),
    });
    const links = [...render(result.html).querySelectorAll("a")].map(
      (a) => `${a.textContent} -> ${a.getAttribute("href")}`,
    );

    expect(links).toEqual([
      "oak.link/swi-3hsg -> https://oak.link/swi-3hsg",
      "C-STEP principles -> https://example.com/c-step",
      "How to practically deliver quizzes in PE -> https://example.com/quizzes",
    ]);
    expect(result.warnings).toContain(
      'The link "risk assessment" goes to "javascript:alert(1)", which isn\'t a web, email or phone link, so it\'s shown without a link.',
    );
  });

  it("uses numbered lists where the numbering definitions say so", () => {
    const result = lessonGuideXmlToHtml({
      documentXml: swimmingLessonGuideDocumentXml,
      numberingXml,
    });
    const circuit = findHeading(render(result.html), "Practice - ‘Circuit’")
      .nextElementSibling as HTMLElement;

    expect(
      circuit.querySelector(":scope > li:nth-child(4) > ol"),
    ).not.toBeNull();
    expect(
      circuit.querySelector(":scope > li:nth-child(2) > ul"),
    ).not.toBeNull();
    expect(result.warnings.join("\n")).not.toContain("list types");
  });

  it("can start the outline at a lower level", () => {
    const result = lessonGuideXmlToHtml(
      { documentXml: swimmingLessonGuideDocumentXml },
      { topHeadingLevel: 3 },
    );

    expect(outline(render(result.html)).slice(9, 11)).toEqual([
      "h3 Preparing for the first lesson",
      "h4 Explanation",
    ]);
  });

  it("can turn off the symbol labels", () => {
    const result = lessonGuideXmlToHtml(
      { documentXml: swimmingLessonGuideDocumentXml },
      { symbolLabels: {} },
    );

    expect(
      paragraphStartingWith(render(result.html), "A. towel")?.innerHTML,
    ).toBe("A. towel <strong>✓</strong>   B. wet wipes   C. water bottle");
  });

  it("rejects XML that isn't a Word document", () => {
    expect(() => lessonGuideXmlToHtml({ documentXml: "<html/>" })).toThrow(
      "Expected a Word document.xml with a <w:body> element",
    );
  });
});

describe("lessonGuideDocxToHtml", () => {
  const PNG_BYTES = new Uint8Array([137, 80, 78, 71]);
  const NAMESPACES = [
    `xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"`,
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"`,
    `xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"`,
    `xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"`,
  ].join(" ");

  const createDocx = async (documentXml: string, rels: string) => {
    const zip = new JSZip();
    zip.file("word/document.xml", documentXml);
    zip.file("word/_rels/document.xml.rels", rels);
    zip.file("word/media/image4.png", PNG_BYTES);
    return zip.generateAsync({ type: "uint8array" });
  };

  it("embeds images that have alt text", async () => {
    const docx = await createDocx(
      swimmingLessonGuideDocumentXml,
      relationshipsXml([
        { id: "rId8", target: "media/image4.png", type: "image" },
      ]),
    );
    const { html, warnings } = await lessonGuideDocxToHtml(docx);
    const warmUpIcon = findHeading(
      render(html),
      "Warm up",
    ).nextElementSibling?.querySelector("img");

    expect(warmUpIcon?.getAttribute("src")).toBe(
      "data:image/png;base64,iVBORw==",
    );
    expect(warmUpIcon?.getAttribute("alt")).toBe(
      "Click on this video icon to open the lesson's media page which, includes a video demonstration for the warm up activity.",
    );
    expect(warmUpIcon?.getAttribute("width")).toBe("30");
    // The anchored icons with no alt text are still left out.
    expect(render(html).querySelectorAll("img")).toHaveLength(4);
    expect(warnings).toContain(
      'Image "image5.png" has alt text that says to click it ("Click on this video icon to open the lesson\'s media page which, includes a video demonstration for the warm up activity."), but it has no link.',
    );
  });

  it("links images that have a link in Word", async () => {
    const documentXml = `<w:document ${NAMESPACES}><w:body><w:p><w:r><w:drawing><wp:inline>
      <wp:extent cx="285750" cy="285750"/>
      <wp:docPr id="1" name="video.png" descr="Watch the warm up video"><a:hlinkClick r:id="rId2"/></wp:docPr>
      <a:graphic><a:graphicData><a:blip r:embed="rId1"/></a:graphicData></a:graphic>
    </wp:inline></w:drawing></w:r></w:p></w:body></w:document>`;
    const docx = await createDocx(
      documentXml,
      relationshipsXml([
        { id: "rId1", target: "media/image4.png", type: "image" },
        { id: "rId2", target: "https://example.com/video", type: "hyperlink" },
      ]),
    );
    const { html, warnings } = await lessonGuideDocxToHtml(docx);

    expect(html).toBe(
      '<p><a href="https://example.com/video"><img src="data:image/png;base64,iVBORw==" alt="Watch the warm up video" width="30" height="30"></a></p>',
    );
    expect(warnings).toEqual([]);
  });

  it("needs a document.xml", async () => {
    const zip = new JSZip();
    zip.file("word/other.xml", "<x/>");

    await expect(
      lessonGuideDocxToHtml(await zip.generateAsync({ type: "uint8array" })),
    ).rejects.toThrow("The .docx file has no word/document.xml");
  });
});

describe("renderStandaloneHtml", () => {
  it("wraps the guide in an accessible page", () => {
    const page = renderStandaloneHtml({
      title: "Preparing for swimming & water safety",
      bodyHtml: "<h2>Lesson outcome</h2>",
    });

    expect(page).toContain('<html lang="en-GB">');
    expect(page).toContain(
      "<title>Preparing for swimming &amp; water safety</title>",
    );
    expect(page).toContain(
      "<main>\n<h1>Preparing for swimming &amp; water safety</h1>\n<h2>Lesson outcome</h2>\n</main>",
    );
    expect(page).toContain(".visually-hidden {");
  });
});
