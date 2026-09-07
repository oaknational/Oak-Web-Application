import { localNationalCurriculumInsightsFixtures } from "./__fixtures__/nationalCurriculumInsights";
import {
  getNationalCurriculumInsightsReader,
  getNationalCurriculumInsightsRouteData,
  type NationalCurriculumInsightsReader,
} from "./getNationalCurriculumInsightsData";

import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";
import CMSClient from "@/node-lib/cms";

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    nationalCurriculumInsightsHub: jest.fn(),
    nationalCurriculumInsightsGuidancePage: jest.fn(),
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
  it("serves published guidance while the hub is unpublished", async () => {
    const reader = {
      ...localNationalCurriculumInsightsFixtures.reader,
      nationalCurriculumInsightsHub: async () => null,
    };
    const data = await getNationalCurriculumInsightsRouteData(
      { kind: "guidance" },
      { previewMode: false, reader },
    );
    expect(data?.page?.pageType).toBe("guidance");
    expect(data?.hub).toBeNull();
    expect(data?.subjects).toEqual([]);
    await expect(
      getNationalCurriculumInsightsRouteData(
        { kind: "hub" },
        { previewMode: false, reader },
      ),
    ).resolves.toBeNull();
    await expect(
      getNationalCurriculumInsightsRouteData(getRoute(["science", "primary"]), {
        previewMode: false,
        reader,
      }),
    ).resolves.toBeNull();
  });

  it("keeps guidance private until published, but allows authenticated draft preview", async () => {
    const reader = {
      ...localNationalCurriculumInsightsFixtures.reader,
      nationalCurriculumInsightsGuidancePage: async ({ previewMode } = {}) =>
        previewMode
          ? localNationalCurriculumInsightsFixtures.reader.nationalCurriculumInsightsGuidancePage(
              { previewMode },
            )
          : null,
    } satisfies NationalCurriculumInsightsReader;
    await expect(
      getNationalCurriculumInsightsRouteData(
        { kind: "guidance" },
        { previewMode: false, reader },
      ),
    ).resolves.toBeNull();
    expect(
      (
        await getNationalCurriculumInsightsRouteData(
          { kind: "guidance" },
          { previewMode: true, reader },
        )
      )?.page,
    ).not.toBeNull();
    expect(
      (
        await getNationalCurriculumInsightsRouteData(
          { kind: "hub" },
          { previewMode: false, reader },
        )
      )?.hub,
    ).not.toBeNull();
  });

  it("rejects unpublished subjects, phases and key stages", async () => {
    for (const segments of [
      ["science"],
      ["science", "primary"],
      ["science", "primary", "key-stage-1"],
    ]) {
      const reader = {
        ...localNationalCurriculumInsightsFixtures.reader,
        nationalCurriculumInsightsSubjectBySlug: async () => null,
      };
      await expect(
        getNationalCurriculumInsightsRouteData(getRoute(segments), {
          previewMode: false,
          reader,
        }),
      ).resolves.toBeNull();
    }
    const reader = {
      ...localNationalCurriculumInsightsFixtures.reader,
      nationalCurriculumInsightsSubjectBySlug: async () => ({
        ...localNationalCurriculumInsightsFixtures.subjects[0]!,
        tabs: [],
      }),
    };
    await expect(
      getNationalCurriculumInsightsRouteData(getRoute(["science", "primary"]), {
        previewMode: false,
        reader,
      }),
    ).resolves.toBeNull();
  });

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
    expect(data?.hub?.modules).toHaveLength(2);
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

  it("resolves the independently editable guidance page", async () => {
    const data = await getNationalCurriculumInsightsRouteData(
      getRoute(["guidance"]),
      {
        previewMode: false,
        reader: localNationalCurriculumInsightsFixtures.reader,
      },
    );

    expect(data?.route.kind).toBe("guidance");
    expect(data?.page?.pageType).toBe("guidance");
    expect(data?.subject).toBeNull();
    expect(data?.activeTab).toBeNull();
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
  it("uses the configured CMS client", () => {
    expect(getNationalCurriculumInsightsReader()).toBe(CMSClient);
  });
});
