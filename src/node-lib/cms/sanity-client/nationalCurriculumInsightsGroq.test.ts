import { createClient } from "@sanity/client";

import {
  getNationalCurriculumInsightsHub,
  getNationalCurriculumInsightsSubjectBySlug,
  nationalCurriculumInsightsHubQuery,
  nationalCurriculumInsightsSubjectBySlugQuery,
} from "./nationalCurriculumInsightsGroq";

jest.mock("@sanity/client", () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;
const mockFetch = jest.fn();

const moduleFixture = {
  __typename: "NationalCurriculumInsightsRichTextSection",
  heading: "Introduction",
  headingStyle: "section",
  contentPortableText: [
    {
      _key: "block",
      _type: "block",
      children: [{ _key: "span", _type: "span", marks: [], text: "Content" }],
      markDefs: [],
      style: "normal",
    },
  ],
};

const pageFixture = {
  id: "nationalCurriculumInsightsPage-science-primary",
  pageType: "primary",
  title: "Primary Science",
  summary: "Primary Science summary",
  keyStages: [
    {
      keyStage: "KS1",
      label: "Key stage 1",
      page: {
        id: "nationalCurriculumInsightsKeyStagePage-science-primary-ks1",
        pageType: "keyStage",
        keyStage: "KS1",
        title: "Science key stage 1",
        summary: "Science key stage 1 summary",
        modules: [moduleFixture],
      },
    },
  ],
  modules: [moduleFixture],
};

const subjectFixture = {
  id: "nationalCurriculumInsightsSubject-science",
  pageType: "overview",
  title: "Science",
  summary: "Science overview summary",
  modules: [moduleFixture],
  slug: { current: "science" },
  curriculumSubjectSlugs: ["biology", "chemistry", "physics"],
  tabs: [
    {
      kind: "primary",
      label: "Primary",
      page: pageFixture,
    },
  ],
};

const hubFixture = {
  id: "nationalCurriculumInsightsHub",
  title: "National curriculum insights",
  summary: "Explore curriculum changes",
  modules: [moduleFixture],
  subjects: [
    {
      ...subjectFixture,
      tabs: subjectFixture.tabs.map(({ kind, label, page }) => ({
        kind,
        label,
        page: { id: page.id, pageType: page.pageType, title: page.title },
      })),
    },
  ],
};

describe("nationalCurriculumInsightsGroq", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockReturnValue({ fetch: mockFetch } as never);
  });

  it("fetches the hub, ordered subject catalogue and hub modules", async () => {
    mockFetch.mockResolvedValueOnce(hubFixture);

    const result = await getNationalCurriculumInsightsHub();

    expect(result?.subjects[0]?.slug).toBe("science");
    expect(result?.modules[0]?.__typename).toBe(
      "NationalCurriculumInsightsRichTextSection",
    );
    expect(mockFetch).toHaveBeenCalledWith(
      nationalCurriculumInsightsHubQuery,
      {
        hubId: "nationalCurriculumInsightsHub",
        draftHubId: "drafts.nationalCurriculumInsightsHub",
      },
      { perspective: "published" },
    );
  });

  it("fetches the subject as Overview and each phase as its own page", async () => {
    mockFetch.mockResolvedValueOnce(subjectFixture);

    const result = await getNationalCurriculumInsightsSubjectBySlug("science");

    expect(result?.pageType).toBe("overview");
    expect(result?.modules).toEqual([moduleFixture]);
    expect(result?.tabs.map(({ kind }) => kind)).toEqual(["primary"]);
    expect(result?.tabs[0]?.page.modules).toEqual([moduleFixture]);
    expect(result?.tabs[0]?.page.keyStages[0]?.page.keyStage).toBe("KS1");
    expect(result?.id).not.toBe(result?.tabs[0]?.page.id);
    expect(mockFetch).toHaveBeenCalledWith(
      nationalCurriculumInsightsSubjectBySlugQuery,
      { subjectSlug: "science" },
      { perspective: "published" },
    );
  });

  it("uses the drafts perspective in Next preview mode", async () => {
    mockFetch.mockResolvedValueOnce(subjectFixture);

    await getNationalCurriculumInsightsSubjectBySlug("science", {
      previewMode: true,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      nationalCurriculumInsightsSubjectBySlugQuery,
      { subjectSlug: "science" },
      { perspective: "drafts" },
    );
    expect(mockCreateClient).toHaveBeenCalledWith(
      expect.objectContaining({ useCdn: false }),
    );
  });

  it("returns null for missing content", async () => {
    mockFetch.mockResolvedValueOnce(null);
    await expect(
      getNationalCurriculumInsightsSubjectBySlug("missing"),
    ).resolves.toBeNull();
  });

  it("rejects a tab whose page type does not match", async () => {
    mockFetch.mockResolvedValueOnce({
      ...subjectFixture,
      tabs: [
        {
          ...subjectFixture.tabs[0],
          page: { ...subjectFixture.tabs[0]!.page, pageType: "secondary" },
        },
      ],
    });

    await expect(
      getNationalCurriculumInsightsSubjectBySlug("science"),
    ).rejects.toThrow();
  });

  it("rejects a page shared by two subjects", async () => {
    mockFetch.mockResolvedValueOnce({
      ...hubFixture,
      subjects: [
        hubFixture.subjects[0],
        {
          ...hubFixture.subjects[0],
          id: "nationalCurriculumInsightsSubject-history",
          slug: { current: "history" },
          title: "History",
        },
      ],
    });

    await expect(getNationalCurriculumInsightsHub()).rejects.toThrow();
  });
});
