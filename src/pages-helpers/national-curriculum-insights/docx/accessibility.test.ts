import { join } from "path";

import JSZip from "jszip";
import type { Element } from "xml-js";

import { generateNationalCurriculumInsightsDocx } from "../docx";

import {
  createDownloadFixture,
  sharedDownloadFixtureModules,
} from "./__fixtures__/downloads";
import { addInsightsDocxStyles } from "./styles";

import { generateEmptyOoxml } from "@/pages-helpers/curriculum/docx/docx";

const layouts = [
  { phase: "primary", stages: ["KS1", "KS2"] },
  { phase: "secondary", stages: ["KS3", "KS4"] },
  { phase: "primary", stages: [] },
  { phase: "secondary", stages: [] },
  { phase: "secondary", stages: ["KS3"] },
] as const;

it.each(layouts)(
  "avoids nested tables and floating textboxes in $phase $stages guidance",
  async ({ phase, stages }) => {
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase,
      subject: createDownloadFixture(phase, [...stages]),
      sharedModules: sharedDownloadFixtureModules,
      siteUrl: "https://www.thenational.academy",
    });
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file("word/document.xml")!.async("string");
    const document = new DOMParser().parseFromString(xml, "application/xml");
    const tables = Array.from(document.getElementsByTagName("w:tbl"));
    expect(
      tables.every((table) => table.getElementsByTagName("w:tbl").length === 0),
    ).toBe(true);
    expect(document.getElementsByTagName("w:txbxContent")).toHaveLength(0);

    const preparationHeadings = Array.from(
      document.getElementsByTagName("w:p"),
    ).filter(
      (paragraph) =>
        paragraph.getElementsByTagName("w:pStyle")[0]?.getAttribute("w:val") ===
          "Heading3" &&
        Array.from(paragraph.getElementsByTagName("w:t"))
          .map((text) => text.textContent)
          .join("") === "3 steps to get ready",
    );
    expect(preparationHeadings).toHaveLength(stages.length || 1);
    for (const heading of preparationHeadings) {
      expect(heading.parentNode?.nodeName).toBe("w:body");
      expect(
        heading.getElementsByTagName("w:pStyle")[0]?.getAttribute("w:val"),
      ).toBe("Heading3");
    }
  },
);

it.each(layouts)(
  "keeps a continuous heading hierarchy in $phase $stages guidance",
  async ({ phase, stages }) => {
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase,
      subject: createDownloadFixture(phase, [...stages]),
      sharedModules: sharedDownloadFixtureModules,
      siteUrl: "https://www.thenational.academy",
    });
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file("word/document.xml")!.async("string");
    const levels = Array.from(
      xml.matchAll(/<w:pStyle w:val="Heading(\d)"\s*\/>/g),
      (match) => Number(match[1]),
    );
    expect(levels.length).toBeGreaterThan(5);
    expect(
      levels.every(
        (level, index) => index === 0 || level <= levels[index - 1]! + 1,
      ),
    ).toBe(true);

    const paragraphs = xml.match(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)!;
    const document = new DOMParser().parseFromString(xml, "application/xml");
    const headlines = Array.from(document.getElementsByTagName("w:p")).filter(
      (paragraph) =>
        paragraph.parentNode?.nodeName === "w:tc" &&
        Array.from(paragraph.getElementsByTagName("w:t"))
          .map((text) => text.textContent)
          .join("") === "The headlines in 60 seconds",
    );
    expect(headlines).toHaveLength(stages.length + 1);
    headlines.forEach((paragraph, index) => {
      expect(
        paragraph.getElementsByTagName("w:pStyle")[0]?.getAttribute("w:val"),
      ).toBe(index === 0 ? "Heading2" : "Heading3");
      expect(
        paragraph.getElementsByTagName("w:rStyle")[0]?.getAttribute("w:val"),
      ).toBe("InsightsHeadline");
      const spacing = paragraph.getElementsByTagName("w:spacing")[0]!;
      expect(spacing.getAttribute("w:before")).toBe("0");
      expect(spacing.getAttribute("w:after")).toBe("240");
    });
    const faq = sharedDownloadFixtureModules.find(
      (module) => module.__typename === "NationalCurriculumInsightsFaqSection",
    )!;
    for (const { question } of faq.items) {
      const paragraph = paragraphs.find((item) => item.includes(question))!;
      expect(paragraph).toContain('w:pStyle w:val="Heading3"');
      expect(paragraph).toContain('w:rStyle w:val="InsightsFaqQuestion"');
      expect(paragraph).toContain('w:before="240"');
      expect(paragraph).toContain('w:after="120"');
    }
    const styles = await zip.file("word/styles.xml")!.async("string");
    const headlineStyle = styles.match(
      /<w:style[^>]*w:styleId="InsightsHeadline"[^>]*>[\s\S]*?<\/w:style>/,
    )![0];
    expect(headlineStyle).toContain('w:type="character"');
    expect(headlineStyle).toContain('w:sz w:val="36"');
    expect(headlineStyle).toContain('w:szCs w:val="36"');
    expect(headlineStyle).not.toMatch(/<w:b(?:Cs)?\s*\/>/);
    const questionStyle = styles.match(
      /<w:style[^>]*w:styleId="InsightsFaqQuestion"[^>]*>[\s\S]*?<\/w:style>/,
    )![0];
    expect(questionStyle).toContain('w:type="character"');
    expect(questionStyle).toContain('w:sz w:val="28"');
    expect(questionStyle).toContain('w:szCs w:val="28"');
    expect(questionStyle).not.toMatch(/<w:b(?:Cs)?\s*\/>/);
    const paragraphStyle = styles.match(
      /<w:style[^>]*w:styleId="Heading3"[^>]*>[\s\S]*?<\/w:style>/,
    )![0];
    expect(paragraphStyle).toContain("w:b/");
    expect(paragraphStyle).toContain("w:bCs/");
  },
);

it("keeps real data tables and their header rows", async () => {
  const subject = createDownloadFixture("primary", []);
  subject.tabs[0]!.page.modules.push({
    __typename: "NationalCurriculumInsightsTableSection",
    heading: "Compare the changes",
    table: {
      rows: [
        { cells: ["Current curriculum", "Proposed curriculum"] },
        { cells: ["Broad themes", "A clearer sequence"] },
      ],
    },
  });
  const zip = await JSZip.loadAsync(
    await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject,
      sharedModules: sharedDownloadFixtureModules,
      siteUrl: "https://www.thenational.academy",
    }),
  );
  const document = new DOMParser().parseFromString(
    await zip.file("word/document.xml")!.async("string"),
    "application/xml",
  );
  const tables = Array.from(document.getElementsByTagName("w:tbl"));
  const dataTable = tables.find(
    (table) => table.getElementsByTagName("w:tblHeader").length === 1,
  );
  expect(dataTable?.getElementsByTagName("w:tr")).toHaveLength(2);
  expect(dataTable?.getElementsByTagName("w:tc")).toHaveLength(4);
  expect(
    Array.from(dataTable!.getElementsByTagName("w:t")).map(
      (text) => text.textContent,
    ),
  ).toEqual([
    "Current curriculum",
    "Proposed curriculum",
    "Broad themes",
    "A clearer sequence",
  ]);
});

it.each(["styles root", "question style", "run properties"])(
  "rejects a Word template without its %s",
  async (missing) => {
    const zip = await generateEmptyOoxml(
      join(
        process.cwd(),
        "src/pages-helpers/national-curriculum-insights/docx/template.docx",
      ),
    );
    const styles = (await zip.readJson("word/styles.xml")) as Element;
    const root = styles.elements!.find(
      (element) => element.name === "w:styles",
    )!;
    if (missing === "styles root") {
      styles.elements = [];
    } else if (missing === "question style") {
      root.elements = root.elements!.filter(
        (element) => element.attributes?.["w:styleId"] !== "Heading4",
      );
    } else {
      const questionStyle = root.elements!.find(
        (element) => element.attributes?.["w:styleId"] === "Heading4",
      )!;
      questionStyle.elements = questionStyle.elements!.filter(
        (element) => element.name !== "w:rPr",
      );
    }
    zip.writeJson("word/styles.xml", styles);
    await expect(addInsightsDocxStyles(zip)).rejects.toThrow(
      "The Word template is missing its FAQ question style.",
    );
  },
);

it.each(["paragraph style", "run properties"])(
  "rejects a Word template without its headline %s",
  async (missing) => {
    const zip = await generateEmptyOoxml(
      join(
        process.cwd(),
        "src/pages-helpers/national-curriculum-insights/docx/template.docx",
      ),
    );
    const styles = (await zip.readJson("word/styles.xml")) as Element;
    const root = styles.elements!.find(
      (element) => element.name === "w:styles",
    )!;
    if (missing === "paragraph style") {
      root.elements = root.elements!.filter(
        (element) => element.attributes?.["w:styleId"] !== "Heading3",
      );
    } else {
      const headlineStyle = root.elements!.find(
        (element) => element.attributes?.["w:styleId"] === "Heading3",
      )!;
      headlineStyle.elements = headlineStyle.elements!.filter(
        (element) => element.name !== "w:rPr",
      );
    }
    zip.writeJson("word/styles.xml", styles);
    await expect(addInsightsDocxStyles(zip)).rejects.toThrow(
      "The Word template is missing its headline style.",
    );
  },
);
