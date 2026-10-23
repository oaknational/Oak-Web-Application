import JSZip from "jszip";

import {
  generateNationalCurriculumInsightsDocx,
  nationalCurriculumInsightsDownloadFilename,
} from "./docx";

import { localNationalCurriculumInsightsFixtures } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/__fixtures__/nationalCurriculumInsights";
import { zipFromFiles } from "@/utils/curriculum/zip";

const science = localNationalCurriculumInsightsFixtures.subjects.find(
  ({ slug }) => slug === "science",
);

if (!science) {
  throw new Error("Expected the Science test fixture");
}

describe("National Curriculum Insights documents", () => {
  it("includes every checklist item in editorial order", async () => {
    const subject = {
      ...science,
      tabs: science.tabs.map((tab) => ({
        ...tab,
        page: {
          ...tab.page,
          modules: [
            ...tab.page.modules,
            {
              __typename: "NationalCurriculumInsightsChecklistSection" as const,
              audience: "teacher" as const,
              heading: "Teacher checklist",
              items: ["Review the topics.", "Plan a timeline."].map(
                (text, index) => ({
                  id: `action-${index}`,
                  contentPortableText: [{ children: [{ text }] }],
                }),
              ),
            },
          ],
        },
      })),
    };
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject,
    });
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file("word/document.xml")!.async("string");
    expect(xml).toContain("Teacher checklist");
    expect(xml).toContain("☐");
    expect(xml).toContain("Review the topics.");
    expect(xml).toContain("Plan a timeline.");
    expect(xml.indexOf("Review the topics.")).toBeLessThan(
      xml.indexOf("Plan a timeline."),
    );
  });

  it("includes a phase page and all of its key-stage pages in one document", async () => {
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject: {
        ...science,
        tabs: science.tabs.map((tab) => ({
          ...tab,
          page: {
            ...tab.page,
            modules: [
              ...tab.page.modules,
              {
                __typename: "NationalCurriculumInsightsSubjectLinksSection",
                heading: "Subject overview navigation",
                links: [
                  {
                    title: "History navigation link",
                    subjectSlug: "history",
                    iconName: "subject-history",
                  },
                ],
              },
              {
                __typename: "NationalCurriculumInsightsDownloadSection",
                barHeading: "Curriculum download form",
                barCtaLabel: "Download guidance",
                detailsHeading: "Your details",
                downloadsHeading: "Choose subjects",
                downloadsIntroduction: "Select subjects to download.",
                downloadButtonLabel: "Download",
              },
            ],
          },
        })),
      },
    });
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")!.async("string");

    expect(documentXml).toContain("Science");
    expect(documentXml).toContain("Primary");
    expect(documentXml).toContain("Key stage 1");
    expect(documentXml).toContain("Key stage 2");
    expect(documentXml).toContain("Independent primary content for Science.");
    expect(documentXml).toContain("Independent KS1 content for Science.");
    expect(documentXml).toContain("Independent KS2 content for Science.");
    expect(documentXml).not.toContain("Independent secondary content");
    expect(documentXml).not.toContain("Independent KS3 content");
    expect(documentXml).not.toContain("Independent KS4 content");
    expect(documentXml).not.toContain("Curriculum download form");
    expect(documentXml).not.toContain("Subject overview navigation");
    expect(documentXml).not.toContain("History navigation link");
  });

  it("exports every change and explanation in editorial order", async () => {
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject: {
        ...science,
        tabs: science.tabs.map((tab) => ({
          ...tab,
          page: {
            ...tab.page,
            modules: [
              {
                __typename: "NationalCurriculumInsightsChangesSection",
                heading: "What's changed",
                changes: ["First", "Second"].map((label) => ({
                  id: label,
                  title: `${label} change`,
                  whyItMatters: `${label} teaching implication`,
                  detailPortableText: [
                    {
                      _type: "block",
                      children: [{ text: `${label} explanation` }],
                    },
                  ],
                })),
              },
            ],
          },
        })),
      },
    });
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file("word/document.xml")!.async("string");
    const content = [
      "First change",
      "First teaching implication",
      "First explanation",
      "Second change",
      "Second teaching implication",
      "Second explanation",
    ];
    const positions = content.map((text) => xml.indexOf(text));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("packages separately generated subject documents into a zip", async () => {
    const primary = await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject: science,
    });
    const secondary = await generateNationalCurriculumInsightsDocx({
      phase: "secondary",
      subject: science,
    });
    const bundle = await zipFromFiles([
      { filename: "Science - Primary.docx", buffer: primary },
      { filename: "Science - Secondary.docx", buffer: secondary },
    ]);
    const zip = await JSZip.loadAsync(bundle);

    expect(Object.keys(zip.files)).toEqual([
      "Science - Primary.docx",
      "Science - Secondary.docx",
    ]);
  });

  it("uses a human-readable subject, phase and date filename", () => {
    expect(
      nationalCurriculumInsightsDownloadFilename({
        phase: "primary",
        subjectTitle: "Science",
      }),
    ).toMatch(
      /^National curriculum insights - Science - Primary - \d{2}-\d{2}-\d{4}\.docx$/,
    );
  });
});
