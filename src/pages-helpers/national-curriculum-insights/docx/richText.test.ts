import JSZip from "jszip";
import { xml2js } from "xml-js";

import { createInsightsDocxRichText, wordText } from "./richText";

import { generateEmptyDocx } from "@/pages-helpers/curriculum/docx/docx";

const block = (text: string, fields: Record<string, unknown> = {}) => ({
  _type: "block",
  children: [{ _type: "span", text, marks: [] }],
  ...fields,
});

const createRenderer = async () => {
  const zip = await generateEmptyDocx();
  const renderer = createInsightsDocxRichText(
    zip,
    "https://www.thenational.academy/curriculum-change-explained/science/primary",
  );
  return { zip, renderer };
};

it("applies a character style without replacing the visible text", () => {
  const output = wordText("Guidance إرشادات", {
    runStyle: "InsightsFaqQuestion",
  });
  expect(output).toContain('w:rStyle w:val="InsightsFaqQuestion"');
  expect(output).toContain("Guidance إرشادات");
});

it("applies a character style to portable-text spans", async () => {
  const { renderer } = await createRenderer();
  const output = await renderer.render([block("Guidance إرشادات")], {
    runStyle: "InsightsFaqQuestion",
  });
  expect(output).toContain('w:rStyle w:val="InsightsFaqQuestion"');
  expect(output).toContain("Guidance إرشادات");
});

it("preserves decorators, whitespace, explicit line breaks and XML characters", async () => {
  const { renderer } = await createRenderer();
  const output = await renderer.render([
    block("", {
      children: [
        {
          text: "  Food & <water>\nPlants  ",
          marks: ["strong", "em", "underline", "strike-through"],
        },
      ],
    }),
  ]);
  expect(output).toMatch(/<w:b\s*\/>/);
  expect(output).toMatch(/<w:i\s*\/>/);
  expect(output).toMatch(/<w:u w:val="single"\s*\/>/);
  expect(output).toMatch(/<w:strike\s*\/>/);
  expect(output).toMatch(/<w:br\s*\/>/);
  expect(output).toContain("  Food & <water>");
  expect(output).toContain("Plants  ");
  expect(() => xml2js(`<root>${output}</root>`)).not.toThrow();
});

it("creates native links to external, relative and resolved internal destinations", async () => {
  const { zip, renderer } = await createRenderer();
  const output = await renderer.render([
    block("", {
      children: [{ text: "Read the report", marks: ["report"] }],
      markDefs: [
        {
          _key: "report",
          _type: "link",
          href: "https://example.org/report?a=1&b=2",
        },
      ],
    }),
    block("", {
      children: [{ text: "Open guidance", marks: ["guidance"] }],
      markDefs: [
        {
          _key: "guidance",
          _type: "link",
          href: "/curriculum-change-explained/guidance#sign-up",
        },
      ],
    }),
    block("", {
      children: [{ text: "Visit this article", marks: ["article"] }],
      markDefs: [
        {
          _key: "article",
          _type: "internalLink",
          reference: {
            id: "article",
            contentType: "newsPost",
            slug: "curriculum-news",
          },
        },
      ],
    }),
  ]);
  await renderer.finish();
  const packageZip = await JSZip.loadAsync(await zip.zipToBuffer());
  const relationships = await packageZip
    .file("word/_rels/document.xml.rels")!
    .async("string");
  expect(output.match(/<w:hyperlink/g)).toHaveLength(3);
  expect(output).toContain("Read the report");
  expect(relationships).toContain("https://example.org/report?a=1&amp;b=2");
  expect(relationships).toContain(
    "https://www.thenational.academy/curriculum-change-explained/guidance#sign-up",
  );
  expect(relationships).toContain(
    "https://www.thenational.academy/blog/curriculum-news",
  );
});

it("retains visible text for unresolved links and refuses unsafe protocols", async () => {
  const { zip, renderer } = await createRenderer();
  const output = await renderer.render([
    block("", {
      children: [{ text: "Missing reference", marks: ["missing"] }],
      markDefs: [
        {
          _key: "missing",
          _type: "internalLink",
          reference: { _type: "reference", _ref: "unpublished" },
        },
      ],
    }),
    block("", {
      children: [{ text: "Unsafe link", marks: ["unsafe"] }],
      markDefs: [
        { _key: "unsafe", _type: "link", href: "javascript:alert(1)" },
      ],
    }),
  ]);
  await renderer.finish();
  const packageZip = await JSZip.loadAsync(await zip.zipToBuffer());
  expect(output).toContain("Missing reference");
  expect(output).toContain("Unsafe link");
  expect(output).not.toContain("w:hyperlink");
  expect(
    await packageZip.file("word/_rels/document.xml.rels")!.async("string"),
  ).not.toContain("javascript:");
});

it("keeps parent numbering across a nested bullet list and restarts a separate list", async () => {
  const { zip, renderer } = await createRenderer();
  const output = await renderer.render([
    block("First numbered item", { listItem: "number", level: 1 }),
    block("Nested bullet", { listItem: "bullet", level: 2 }),
    block("Second numbered item", { listItem: "number", level: 1 }),
    block("A paragraph between lists"),
    block("New first item", { listItem: "number", level: 1 }),
  ]);
  const ids = Array.from(
    output.matchAll(/<w:numId w:val="(\d+)"/g),
    (match) => match[1],
  );
  expect(ids).toHaveLength(4);
  expect(ids[0]).toBe(ids[2]);
  expect(ids[1]).not.toBe(ids[0]);
  expect(ids[3]).not.toBe(ids[0]);
  const packageZip = await JSZip.loadAsync(await zip.zipToBuffer());
  const numbering = await packageZip
    .file("word/numbering.xml")!
    .async("string");
  expect(numbering).toContain('w:numFmt w:val="decimal"');
  expect(numbering).toContain('w:numFmt w:val="bullet"');
  expect(output).toContain('w:ilvl w:val="1"');
  expect(output).not.toContain("• First numbered item");
  const document = new DOMParser().parseFromString(
    numbering,
    "application/xml",
  );
  const instances = Array.from(document.getElementsByTagName("w:num")).filter(
    (instance) => ids.includes(instance.getAttribute("w:numId")!),
  );
  expect(instances).toHaveLength(3);
  for (const instance of instances) {
    expect(
      instance
        .getElementsByTagName("w:startOverride")[0]
        ?.getAttribute("w:val"),
    ).toBe("1");
  }
});

it("formats the last rendered paragraph without counting unsupported blocks", async () => {
  const { renderer } = await createRenderer();
  const output = await renderer.render(
    [block("First paragraph"), block("Last paragraph"), { _type: "image" }],
    {
      after: 160,
      prefix: wordText("Introduction"),
      lastParagraphOptions: { after: 0 },
    },
  );
  const paragraphs = new DOMParser()
    .parseFromString(
      `<root xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${output}</root>`,
      "application/xml",
    )
    .getElementsByTagName("w:p");
  expect(paragraphs).toHaveLength(2);
  expect(
    paragraphs[0]!
      .getElementsByTagName("w:spacing")[0]
      ?.getAttribute("w:after"),
  ).toBe("160");
  expect(
    paragraphs[1]!
      .getElementsByTagName("w:spacing")[0]
      ?.getAttribute("w:after"),
  ).toBe("0");
  expect(output.match(/Introduction/g)).toHaveLength(1);
});

it("uses heading styles and does not invent a list marker for ordinary text", async () => {
  const { renderer } = await createRenderer();
  const output = await renderer.render([
    block("Section heading", { style: "h2" }),
    block("Smaller heading", { style: "h3" }),
    block("Ordinary text"),
  ]);
  expect(output).toContain('w:pStyle w:val="Heading3"');
  expect(output).toContain('w:pStyle w:val="Heading4"');
  expect(output).not.toContain("w:numPr");
});
