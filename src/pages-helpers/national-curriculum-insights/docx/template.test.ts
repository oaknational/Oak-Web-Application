import JSZip from "jszip";
import { xml2js } from "xml-js";

import { generateNationalCurriculumInsightsDocx } from "../docx";

import {
  createDownloadFixture,
  sharedDownloadFixtureModules,
} from "./__fixtures__/downloads";

import type {
  NationalCurriculumInsightsKeyStage,
  NationalCurriculumInsightsModule,
  NationalCurriculumInsightsPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

const layouts: {
  phase: NationalCurriculumInsightsPhase;
  stages: NationalCurriculumInsightsKeyStage[];
}[] = [
  { phase: "primary", stages: ["KS1", "KS2"] },
  { phase: "secondary", stages: ["KS3", "KS4"] },
  { phase: "primary", stages: [] },
  { phase: "secondary", stages: [] },
  { phase: "secondary", stages: ["KS3"] },
  { phase: "primary", stages: ["KS2"] },
];

it.each(layouts)(
  "builds valid editable Word content for $phase with $stages",
  async ({ phase, stages }) => {
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase,
      subject: createDownloadFixture(phase, stages),
      sharedModules: sharedDownloadFixtureModules,
      siteUrl: "https://www.thenational.academy",
      downloadedAt: new Date(2026, 9, 13),
    });
    const zip = await JSZip.loadAsync(buffer);
    for (const entry of Object.values(zip.files)) {
      if (entry.name.endsWith(".xml") || entry.name.endsWith(".rels")) {
        const xml = await entry.async("string");
        expect(() => xml2js(xml)).not.toThrow();
        expect(xml).not.toMatch(/\{\{(?:title|url|editorialDate)\}\}/);
        expect(xml).not.toContain("[subject]");
      }
    }
    const xml = await zip.file("word/document.xml")!.async("string");
    expect(
      new DOMParser()
        .parseFromString(xml, "application/xml")
        .getElementsByTagName("parsererror"),
    ).toHaveLength(0);
    const header = await zip.file("word/header1.xml")!.async("string");
    const footer = await zip.file("word/footer1.xml")!.async("string");
    const footerRels = await zip
      .file("word/_rels/footer1.xml.rels")!
      .async("string");
    expect(xml).toContain(`Changes to the national curriculum: ${phase}`);
    expect(xml).toContain("Last updated 6 October 2026");
    expect(xml).not.toContain("13 October 2026");
    expect(xml).not.toContain("Internal phase");
    expect(xml).not.toContain("Internal key-stage");
    expect(xml).toContain('w:pgSz w:w="11906" w:h="16838"');
    expect(xml).toContain("w:titlePg");
    expect(xml.match(/<w:drawing/g)).toHaveLength(3);
    expect(xml).not.toContain("<w:tbl>");
    const document = new DOMParser().parseFromString(xml, "application/xml");
    for (const pageBreak of Array.from(
      document.getElementsByTagName("w:pageBreakBefore"),
    )) {
      const paragraph = pageBreak.parentElement?.parentElement;
      expect(
        paragraph?.previousElementSibling?.textContent?.trim(),
      ).toBeTruthy();
    }
    expect(footer).toContain("w:drawing");
    expect(header).toContain(`curriculum: ${phase}`);
    expect(footer).toContain('r:id="rIdInsightsHub"');
    expect(footer).toContain("the curriculum insights hub");
    expect(footer).toContain("PAGE");
    const settings = await zip.file("word/settings.xml")!.async("string");
    expect(settings).not.toContain("w:updateFields");
    for (const entry of Object.values(zip.files)) {
      if (!entry.name.startsWith("word/") || !entry.name.endsWith(".xml"))
        continue;
      const part = await entry.async("string");
      const fieldInstructions = Array.from(
        part.matchAll(/<w:instrText[^>]*>([^<]*)<\/w:instrText>/g),
        (match) => match[1]!.trim(),
      );
      expect(
        fieldInstructions.every((instruction) => instruction === "PAGE"),
      ).toBe(true);
    }
    expect(footerRels).toContain(
      'Target="https://www.thenational.academy/curriculum-change-explained"',
    );
    expect(xml.match(/Prepare with confidence using Oak/g)).toHaveLength(2);
    expect(xml.match(/Frequently asked questions/g)).toHaveLength(2);
    const bookmarks = new Set(
      Array.from(xml.matchAll(/w:name="(insight\d+)"/g), (match) => match[1]),
    );
    const links = Array.from(
      xml.matchAll(/w:anchor="(insight\d+)"/g),
      (match) => match[1],
    );
    expect(links.length).toBeGreaterThan(5);
    expect(links.every((name) => bookmarks.has(name))).toBe(true);
    if (stages.length === 2) {
      expect(xml.indexOf(`${stages[0]} Science`)).toBeLessThan(
        xml.indexOf(`${stages[1]} Science`),
      );
    }
    if (stages.length === 1) {
      const body = document.getElementsByTagName("w:body")[0]!;
      const paragraphs = Array.from(body.children).filter(
        (element) => element.nodeName === "w:p",
      );
      const subtitle = paragraphs[2]!;
      expect(subtitle.textContent).toBe(stages[0]);
      expect(paragraphs[1]!.textContent).toContain(
        `curriculum: ${phase} Science`,
      );
    }
    const styles = await zip.file("word/styles.xml")!.async("string");
    const styleIds = Array.from(
      styles.matchAll(/w:styleId="([^"]+)"/g),
      (match) => match[1],
    );
    expect(new Set(styleIds).size).toBe(styleIds.length);
    expect(styles).toContain('w:default="1" w:styleId="Normal"');
    expect(styles).toContain('w:default="1" w:styleId="DefaultParagraphFont"');
  },
);

it("keeps a local closing section instead of adding the shared version twice", async () => {
  const subject = createDownloadFixture("primary", []);
  const confidence = {
    ...sharedDownloadFixtureModules[0]!,
    heading: "Local preparation guidance",
  };
  subject.tabs[0]!.page.modules.push(confidence);
  const buffer = await generateNationalCurriculumInsightsDocx({
    phase: "primary",
    subject,
    sharedModules: sharedDownloadFixtureModules,
    siteUrl: "https://www.thenational.academy",
  });
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml")!.async("string");
  expect(xml.match(/Local preparation guidance/g)).toHaveLength(2);
  expect(xml).not.toContain("Prepare with confidence using Oak");
});

it.each(["missing", "empty", "whitespace"])(
  "rejects a download with %s phase headlines even when key-stage content exists",
  async (content) => {
    const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
    const page = subject.tabs[0]!.page;
    page.modules = page.modules.flatMap(
      (module): NationalCurriculumInsightsModule[] => {
        if (module.__typename !== "NationalCurriculumInsightsOverviewSection") {
          return [module];
        }
        if (content === "missing") return [];
        return [
          {
            ...module,
            bodyPortableText:
              content === "empty"
                ? []
                : [
                    {
                      _type: "block",
                      children: [{ text: " \n\t " }],
                    },
                  ],
          },
        ];
      },
    );

    await expect(
      generateNationalCurriculumInsightsDocx({
        phase: "primary",
        subject,
        siteUrl: "https://www.thenational.academy",
      }),
    ).rejects.toThrow("The phase headlines are not available yet.");
  },
);

it("allows oversized preparation steps to flow without losing their attribution", async () => {
  const subject = createDownloadFixture("primary", []);
  subject.tabs[0]!.page.modules = subject.tabs[0]!.page.modules.map((module) =>
    module.__typename === "NationalCurriculumInsightsPreparationSection"
      ? {
          ...module,
          steps: module.steps.map((step, index) => ({
            ...step,
            text: `${"Review how the curriculum builds on earlier learning. ".repeat(60)}End of step ${index + 1}`,
          })),
        }
      : module,
  );
  const buffer = await generateNationalCurriculumInsightsDocx({
    phase: "primary",
    subject,
    sharedModules: sharedDownloadFixtureModules,
    siteUrl: "https://www.thenational.academy",
  });
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml")!.async("string");
  expect(xml).not.toContain("<w:cantSplit");
  const document = new DOMParser().parseFromString(xml, "application/xml");
  const steps = Array.from(document.getElementsByTagName("w:p")).filter(
    (paragraph) => paragraph.textContent?.includes("End of step"),
  );
  expect(steps).toHaveLength(3);
  for (const step of steps) {
    expect(step.parentNode?.nodeName).toBe("w:body");
    expect(step.getElementsByTagName("w:keepLines")).toHaveLength(0);
    expect(step.getElementsByTagName("w:keepNext")).toHaveLength(0);
  }
  for (const step of [1, 2, 3]) expect(xml).toContain(`End of step ${step}`);
  expect(xml.match(/A subject specialist/g)).toHaveLength(2);
});
