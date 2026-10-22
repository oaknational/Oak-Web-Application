import JSZip from "jszip";

import {
  generateNationalCurriculumInsightsDocx,
  nationalCurriculumInsightsDownloadFilename,
} from "./docx";
import {
  createDownloadFixture,
  sharedDownloadFixtureModules,
} from "./docx/__fixtures__/downloads";

import { localNationalCurriculumInsightsFixtures } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/__fixtures__/nationalCurriculumInsights";
import { zipFromFiles } from "@/utils/curriculum/zip";

jest.mock("@/browser-lib/getBrowserConfig", () => ({
  __esModule: true,
  default: () => "https://www.thenational.academy",
}));

const scienceFixture = localNationalCurriculumInsightsFixtures.subjects.find(
  ({ slug }) => slug === "science",
);

if (!scienceFixture) {
  throw new Error("Expected the Science test fixture");
}

const science = {
  ...scienceFixture,
  tabs: scienceFixture.tabs.map((tab) => {
    const completePage = createDownloadFixture(
      tab.kind,
      tab.page.keyStages.map(({ keyStage }) => keyStage),
    ).tabs[0]!.page;
    return {
      ...tab,
      page: {
        ...tab.page,
        modules: [
          {
            __typename: "NationalCurriculumInsightsOverviewSection" as const,
            heading: "The headlines in 60 seconds",
            bodyPortableText: [
              {
                _type: "block",
                children: [
                  { text: `Phase headlines for ${tab.kind} Science.` },
                ],
              },
            ],
          },
          ...tab.page.modules.filter(
            (module) =>
              module.__typename !== "NationalCurriculumInsightsOverviewSection",
          ),
          ...sharedDownloadFixtureModules,
        ],
        keyStages: tab.page.keyStages.map((stage, index) => ({
          ...stage,
          page: {
            ...stage.page,
            modules: [
              ...stage.page.modules.filter(
                (module) =>
                  module.__typename !==
                  "NationalCurriculumInsightsOverviewSection",
              ),
              ...completePage.keyStages[index]!.page.modules.filter(
                (module) =>
                  module.__typename !==
                  "NationalCurriculumInsightsHeaderSection",
              ),
              ...sharedDownloadFixtureModules,
            ],
          },
        })),
      },
    };
  }),
};

describe("National Curriculum Insights documents", () => {
  it("rejects downloads before a phase layout is configured", async () => {
    await expect(
      generateNationalCurriculumInsightsDocx({
        phase: "primary",
        subject: {
          ...science,
          tabs: science.tabs.map((tab) => ({
            ...tab,
            page: { ...tab.page, downloadLayout: undefined },
          })),
        },
      }),
    ).rejects.toThrow(
      "Guidance downloads are not set up for this subject yet.",
    );
  });

  it("rejects a document when a configured key-stage page is not published", async () => {
    const incompleteSubject = {
      ...science,
      tabs: science.tabs.map((tab) => ({
        ...tab,
        page: {
          ...tab.page,
          expectedKeyStages: ["KS1" as const, "KS2" as const],
          keyStages: tab.page.keyStages.slice(0, 1),
        },
      })),
    };

    await expect(
      generateNationalCurriculumInsightsDocx({
        phase: "primary",
        subject: incompleteSubject,
      }),
    ).rejects.toThrow("Some required guidance is not published yet.");
  });

  it("exports the confidence callout from the same content as the page", async () => {
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject: {
        ...science,
        tabs: science.tabs.map((tab) => ({
          ...tab,
          page: {
            ...tab.page,
            modules: [
              ...tab.page.modules.filter(
                (module) =>
                  module.__typename ===
                    "NationalCurriculumInsightsOverviewSection" ||
                  module.__typename ===
                    "NationalCurriculumInsightsHeaderSection",
              ),
              {
                __typename: "NationalCurriculumInsightsConfidenceSection",
                heading: "Prepare with confidence using Oak",
                bodyPortableText: [
                  {
                    _type: "block",
                    children: [
                      { text: "Use these curriculum plans to prepare." },
                    ],
                  },
                ],
                cta: {
                  label: "Explore curriculum plans",
                  linkType: "external",
                  external:
                    "https://www.thenational.academy/teachers/curriculum/science-primary/overview",
                },
              },
            ],
          },
        })),
      },
    });
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file("word/document.xml")!.async("string");
    expect(xml).toContain("Prepare with confidence using Oak");
    expect(xml).toContain("Use these curriculum plans to prepare.");
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
    expect(documentXml).toContain("curriculum: primary Science");
    expect(documentXml).toContain("KS1 Science");
    expect(documentXml).toContain("KS2 Science");
    expect(documentXml).toContain("Phase headlines for primary Science.");
    expect(documentXml).toContain(
      "The KS1 curriculum builds on what pupils already know.",
    );
    expect(documentXml).toContain(
      "The KS2 curriculum builds on what pupils already know.",
    );
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
              ...tab.page.modules.filter(
                (module) =>
                  module.__typename ===
                    "NationalCurriculumInsightsOverviewSection" ||
                  module.__typename ===
                    "NationalCurriculumInsightsHeaderSection",
              ),
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

  it("removes path separators and control characters from filenames", () => {
    const filename = nationalCurriculumInsightsDownloadFilename({
      phase: "primary",
      subjectTitle: '../Art / Design\\Music: "examples"\r\n?*<>|',
      downloadedAt: new Date(2026, 9, 13),
    });
    expect(filename).toBe(
      "National curriculum insights - Art Design Music examples - Primary - 13-10-2026.docx",
    );
  });

  it("keeps long Unicode filenames within a safe byte length", () => {
    const filename = nationalCurriculumInsightsDownloadFilename({
      phase: "secondary",
      subjectTitle: "音楽".repeat(100),
      downloadedAt: new Date(2026, 9, 13),
    });
    expect(Buffer.byteLength(filename, "utf8")).toBeLessThan(210);
    expect(filename).not.toContain("�");
  });
});
