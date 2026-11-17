import { generateNationalCurriculumInsightsDocx } from "../docx";
import { NationalCurriculumInsightsDownloadUnavailableError } from "../downloadLayout";

import {
  createDownloadFixture,
  sharedDownloadFixtureModules,
} from "./__fixtures__/downloads";

import type {
  NationalCurriculumInsightsModule,
  NationalCurriculumInsightsSubject,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

const generate = (
  subject: NationalCurriculumInsightsSubject,
  sharedModules = sharedDownloadFixtureModules,
) =>
  generateNationalCurriculumInsightsDocx({
    phase: subject.tabs[0]!.kind,
    subject,
    sharedModules,
    siteUrl: "https://www.thenational.academy",
  });

const incompleteMessage =
  "Some required guidance is incomplete. Please try again later.";

it("includes sections from the sidebar article in the download", async () => {
  const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
  for (const { page } of subject.tabs[0]!.page.keyStages) {
    const sections = page.modules.filter(
      (module) =>
        module.__typename === "NationalCurriculumInsightsChangesSection" ||
        module.__typename === "NationalCurriculumInsightsUnchangedSection" ||
        module.__typename === "NationalCurriculumInsightsChecklistSection" ||
        module.__typename === "NationalCurriculumInsightsPreparationSection" ||
        module.__typename === "NationalCurriculumInsightsConfidenceSection",
    );
    const articleSections = new Set<NationalCurriculumInsightsModule>(sections);
    page.modules = [
      ...page.modules.filter((module) => !articleSections.has(module)),
      {
        __typename: "NationalCurriculumInsightsArticleSection",
        sections: sections.map((module, index) => ({
          ...module,
          id: `section-${index}`,
        })),
      },
    ];
  }
  await expect(generate(subject)).resolves.toBeDefined();
});

const requiredSections = [
  { type: "NationalCurriculumInsightsOverviewSection" },
  { type: "NationalCurriculumInsightsChangesSection" },
  { type: "NationalCurriculumInsightsUnchangedSection" },
  { type: "NationalCurriculumInsightsPreparationSection" },
  { type: "NationalCurriculumInsightsChecklistSection", audience: "teacher" },
  {
    type: "NationalCurriculumInsightsChecklistSection",
    audience: "schoolLeader",
  },
] as const;

it.each(requiredSections)(
  "rejects a key stage without its required $type section",
  async ({ type, ...fields }) => {
    const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
    const page = subject.tabs[0]!.page.keyStages[0]!.page;
    page.modules = page.modules.filter(
      (module) =>
        module.__typename !== type ||
        ("audience" in fields &&
          "audience" in module &&
          module.audience !== fields.audience),
    );
    await expect(generate(subject)).rejects.toThrow(incompleteMessage);
  },
);

it.each(requiredSections)(
  "rejects an ambiguous duplicate $type section",
  async ({ type, ...fields }) => {
    const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
    const page = subject.tabs[0]!.page.keyStages[0]!.page;
    const duplicate = page.modules.find(
      (module) =>
        module.__typename === type &&
        (!("audience" in fields) ||
          ("audience" in module && module.audience === fields.audience)),
    );
    page.modules.push(duplicate!);
    await expect(generate(subject)).rejects.toThrow(incompleteMessage);
  },
);

it("checks every included key stage, not only the first one", async () => {
  const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
  subject.tabs[0]!.page.keyStages[1]!.page.modules = [];
  await expect(generate(subject)).rejects.toThrow(incompleteMessage);
});

it("rejects a whole-phase insight without its teacher checklist", async () => {
  const subject = createDownloadFixture("primary", []);
  subject.tabs[0]!.page.modules = subject.tabs[0]!.page.modules.filter(
    (module) =>
      module.__typename !== "NationalCurriculumInsightsChecklistSection" ||
      module.audience !== "teacher",
  );
  await expect(generate(subject)).rejects.toThrow(incompleteMessage);
});

it.each([
  "NationalCurriculumInsightsConfidenceSection",
  "NationalCurriculumInsightsFaqSection",
])("requires the shared closing %s", async (type) => {
  const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
  await expect(
    generate(
      subject,
      sharedDownloadFixtureModules.filter(
        (module) => module.__typename !== type,
      ),
    ),
  ).rejects.toThrow("Shared guidance is not available yet.");
});

it("rejects empty FAQ answers instead of falling back to another page's copy", async () => {
  const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
  subject.tabs[0]!.page.modules.push({
    __typename: "NationalCurriculumInsightsFaqSection",
    heading: "Local FAQ",
    items: [{ question: "Is this ready?", answerPortableText: [] }],
  });
  await expect(generate(subject)).rejects.toThrow(
    "Shared guidance is not available yet.",
  );
});

it.each([
  { phase: "primary", stages: ["KS1", "KS2"] },
  { phase: "secondary", stages: ["KS3", "KS4"] },
  { phase: "primary", stages: [] },
  { phase: "secondary", stages: [] },
  { phase: "primary", stages: ["KS2"] },
  { phase: "secondary", stages: ["KS3"] },
] as const)(
  "accepts complete guidance for $phase $stages",
  async ({ phase, stages }) => {
    const document = await generate(createDownloadFixture(phase, [...stages]));
    expect(document.subarray(0, 2).toString()).toBe("PK");
  },
);

it("returns the existing availability error type for incomplete content", async () => {
  const subject = createDownloadFixture("primary", []);
  subject.tabs[0]!.page.modules = subject.tabs[0]!.page.modules.filter(
    (module) =>
      module.__typename === "NationalCurriculumInsightsOverviewSection",
  );
  await expect(generate(subject)).rejects.toThrow(
    NationalCurriculumInsightsDownloadUnavailableError,
  );
});

it.each([
  "empty change detail",
  "empty continuity",
  "empty checklist action",
  "missing preparation attribution",
])("rejects %s within an otherwise complete key stage", async (incomplete) => {
  const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
  const page = subject.tabs[0]!.page.keyStages[0]!.page;
  page.modules = page.modules.map(
    (module): NationalCurriculumInsightsModule => {
      if (
        incomplete === "empty change detail" &&
        module.__typename === "NationalCurriculumInsightsChangesSection"
      ) {
        return {
          ...module,
          changes: module.changes.map((change) => ({
            ...change,
            detailPortableText: [],
          })),
        };
      }
      if (
        incomplete === "empty continuity" &&
        module.__typename === "NationalCurriculumInsightsUnchangedSection"
      ) {
        return { ...module, contentPortableText: [] };
      }
      if (
        incomplete === "empty checklist action" &&
        module.__typename === "NationalCurriculumInsightsChecklistSection"
      ) {
        return {
          ...module,
          items: module.items.map((item) => ({
            ...item,
            contentPortableText: [],
          })),
        };
      }
      if (
        incomplete === "missing preparation attribution" &&
        module.__typename === "NationalCurriculumInsightsPreparationSection"
      ) {
        return { ...module, attribution: " " };
      }
      return module;
    },
  );
  await expect(generate(subject)).rejects.toThrow(incompleteMessage);
});

it.each([1, 7])("rejects guidance with %i changes", async (count) => {
  const subject = createDownloadFixture("primary", []);
  subject.tabs[0]!.page.modules = subject.tabs[0]!.page.modules.map((module) =>
    module.__typename === "NationalCurriculumInsightsChangesSection"
      ? {
          ...module,
          changes: Array.from({ length: count }, (_, index) => ({
            ...module.changes[0]!,
            id: `change-${index}`,
          })),
        }
      : module,
  );
  await expect(generate(subject)).rejects.toThrow(incompleteMessage);
});

it.each([2, 4])("rejects guidance with %i preparation steps", async (count) => {
  const subject = createDownloadFixture("primary", []);
  subject.tabs[0]!.page.modules = subject.tabs[0]!.page.modules.map((module) =>
    module.__typename === "NationalCurriculumInsightsPreparationSection"
      ? {
          ...module,
          steps: Array.from({ length: count }, (_, index) => ({
            ...module.steps[0]!,
            id: `step-${index}`,
          })),
        }
      : module,
  );
  await expect(generate(subject)).rejects.toThrow(incompleteMessage);
});

it("rejects whitespace-only key-stage headlines", async () => {
  const subject = createDownloadFixture("primary", ["KS1", "KS2"]);
  const page = subject.tabs[0]!.page.keyStages[0]!.page;
  page.modules = page.modules.map((module) =>
    module.__typename === "NationalCurriculumInsightsOverviewSection"
      ? {
          ...module,
          bodyPortableText: [
            { _type: "block", children: [{ text: " \n\t " }] },
          ],
        }
      : module,
  );
  await expect(generate(subject)).rejects.toThrow(incompleteMessage);
});

it.each(["confidence", "FAQ"])(
  "rejects whitespace-only shared %s content",
  async (section) => {
    const sharedModules = sharedDownloadFixtureModules.map((module) => {
      if (
        section === "confidence" &&
        module.__typename === "NationalCurriculumInsightsConfidenceSection"
      ) {
        return {
          ...module,
          bodyPortableText: [
            { _type: "block", children: [{ text: " \n\t " }] },
          ],
        };
      }
      if (
        section === "FAQ" &&
        module.__typename === "NationalCurriculumInsightsFaqSection"
      ) {
        return {
          ...module,
          items: module.items.map((item) => ({ ...item, question: " \n\t " })),
        };
      }
      return module;
    });
    await expect(
      generate(createDownloadFixture("primary", []), sharedModules),
    ).rejects.toThrow("Shared guidance is not available yet.");
  },
);
