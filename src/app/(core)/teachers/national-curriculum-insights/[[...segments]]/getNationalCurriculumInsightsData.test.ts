import {
  getNationalCurriculumInsightsReader,
  getNationalCurriculumInsightsRouteData,
  localNationalCurriculumInsightsFixtures,
  type NationalCurriculumInsightsReader,
} from "./getNationalCurriculumInsightsData";

import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    nationalCurriculumInsightsHub: jest.fn(),
    nationalCurriculumInsightsSubjectBySlug: jest.fn(),
  },
}));

const getRoute = (segments?: string[]) => {
  const route = parseNationalCurriculumInsightsRoute(segments);
  if (!route) {
    throw new Error("Expected a valid test route");
  }
  return route;
};

describe("getNationalCurriculumInsightsRouteData", () => {
  it("keeps the configured subject catalogue order on the hub", async () => {
    const data = await getNationalCurriculumInsightsRouteData(getRoute(), {
      previewMode: false,
      reader: localNationalCurriculumInsightsFixtures.reader,
    });

    expect(data?.subjects.map(({ slug }) => slug)).toEqual([
      "science",
      "english",
      "maths",
      "history",
    ]);
    expect(data?.page).toBeNull();
    expect(data?.hub.modules).toHaveLength(2);
  });

  it("resolves the subject itself as the independently editable Overview page", async () => {
    const data = await getNationalCurriculumInsightsRouteData(
      getRoute(["science"]),
      {
        previewMode: false,
        reader: localNationalCurriculumInsightsFixtures.reader,
      },
    );

    expect(data?.activeTab).toBe("overview");
    expect(data?.page?.pageType).toBe("overview");
    expect(data?.page?.id).toBe("nationalCurriculumInsightsSubject-science");
    expect(data?.page).toBe(data?.subject);
  });

  it("resolves Primary and Secondary from the subject's own tab references", async () => {
    const primary = await getNationalCurriculumInsightsRouteData(
      getRoute(["science", "primary"]),
      {
        previewMode: false,
        reader: localNationalCurriculumInsightsFixtures.reader,
      },
    );
    const secondary = await getNationalCurriculumInsightsRouteData(
      getRoute(["science", "secondary"]),
      {
        previewMode: false,
        reader: localNationalCurriculumInsightsFixtures.reader,
      },
    );

    expect(primary?.page?.pageType).toBe("primary");
    expect(secondary?.page?.pageType).toBe("secondary");
    expect(primary?.page?.id).not.toBe(secondary?.page?.id);
    expect(primary?.page?.modules).not.toBe(secondary?.page?.modules);
  });

  it("resolves a configured key stage below its owning phase page", async () => {
    const data = await getNationalCurriculumInsightsRouteData(
      getRoute(["science", "primary", "key-stage-1"]),
      {
        previewMode: false,
        reader: localNationalCurriculumInsightsFixtures.reader,
      },
    );

    expect(data?.activeTab).toBe("primary");
    expect(data?.activeKeyStage).toBe("KS1");
    expect(data?.page?.pageType).toBe("keyStage");
    expect(data?.page?.id).toContain("key-stage-1");
  });

  it("uses draft page content only in preview mode", async () => {
    const published = await getNationalCurriculumInsightsRouteData(
      getRoute(["science", "primary"]),
      {
        previewMode: false,
        reader: localNationalCurriculumInsightsFixtures.reader,
      },
    );
    const draft = await getNationalCurriculumInsightsRouteData(
      getRoute(["science", "primary"]),
      {
        previewMode: true,
        reader: localNationalCurriculumInsightsFixtures.reader,
      },
    );

    expect(published?.page?.title).toBe("Science primary page");
    expect(draft?.page?.title).toBe("Draft Science primary page");
    expect(draft?.page?.id).toMatch(/^drafts\./);
  });

  it("rejects unknown subjects and phases not configured as tabs", async () => {
    await expect(
      getNationalCurriculumInsightsRouteData(getRoute(["missing-subject"]), {
        previewMode: false,
        reader: localNationalCurriculumInsightsFixtures.reader,
      }),
    ).resolves.toBeNull();
    await expect(
      getNationalCurriculumInsightsRouteData(
        getRoute(["english", "secondary"]),
        {
          previewMode: false,
          reader: localNationalCurriculumInsightsFixtures.reader,
        },
      ),
    ).resolves.toBeNull();
    await expect(
      getNationalCurriculumInsightsRouteData(
        getRoute(["english", "primary", "key-stage-2"]),
        {
          previewMode: false,
          reader: {
            ...localNationalCurriculumInsightsFixtures.reader,
            nationalCurriculumInsightsSubjectBySlug: async (subjectSlug) => {
              const subject =
                localNationalCurriculumInsightsFixtures.subjects.find(
                  ({ slug }) => slug === subjectSlug,
                );
              return subject
                ? {
                    ...subject,
                    tabs: subject.tabs.map((tab) => ({
                      ...tab,
                      page: { ...tab.page, keyStages: [] },
                    })),
                  }
                : null;
            },
          },
        },
      ),
    ).resolves.toBeNull();
  });

  it("rejects a subject response that is not the hub's referenced document", async () => {
    const reader: NationalCurriculumInsightsReader = {
      ...localNationalCurriculumInsightsFixtures.reader,
      nationalCurriculumInsightsSubjectBySlug: async () => ({
        ...localNationalCurriculumInsightsFixtures.subjects[0]!,
        id: "another-science-document",
      }),
    };

    await expect(
      getNationalCurriculumInsightsRouteData(getRoute(["science"]), {
        previewMode: false,
        reader,
      }),
    ).resolves.toBeNull();
  });
});

describe("getNationalCurriculumInsightsReader", () => {
  const originalFixtures =
    process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_FIXTURES;
  const originalRuntime =
    process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME;

  afterEach(() => {
    if (originalFixtures === undefined) {
      delete process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_FIXTURES;
    } else {
      process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_FIXTURES =
        originalFixtures;
    }
    if (originalRuntime === undefined) {
      delete process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME;
    } else {
      process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME =
        originalRuntime;
    }
  });

  it("uses the exported feature-dataset snapshot in the local preview runtime", async () => {
    process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_FIXTURES = "true";
    process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME = "true";

    const hub =
      await getNationalCurriculumInsightsReader().nationalCurriculumInsightsHub(
        { previewMode: false },
      );

    expect(hub?.subjects).toHaveLength(16);
    expect(hub?.modules.map(({ __typename }) => __typename)).toEqual([
      "NationalCurriculumInsightsHeroSection",
      "NationalCurriculumInsightsPromotionalHeadingSection",
      "NationalCurriculumInsightsSubjectNavigationSection",
      "NationalCurriculumInsightsNewsletterSection",
      "NationalCurriculumInsightsFaqSection",
    ]);
  });

  it("rejects preview content outside development or the dedicated runtime", () => {
    process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_FIXTURES = "true";
    delete process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME;

    expect(() => getNationalCurriculumInsightsReader()).toThrow(
      "dedicated local preview runtime",
    );
  });
});
