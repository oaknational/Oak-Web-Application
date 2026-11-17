import { createClient } from "@sanity/client";

import {
  getNationalCurriculumInsightsHub,
  getNationalCurriculumInsightsSubjectBySlug,
  nationalCurriculumInsightsHubQuery,
  nationalCurriculumInsightsSubjectBySlugQuery,
  nationalCurriculumInsightsGuidancePageQuery,
  insightsPortableTextProjection,
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
  phaseLinks: [],
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

  it("reads one shared subject link list for all page modules", () => {
    expect(nationalCurriculumInsightsSubjectBySlugQuery).toContain(
      ".subjectOverviewLinks[",
    );
    expect(nationalCurriculumInsightsHubQuery).toContain(
      ".subjectOverviewLinks[",
    );
    expect(nationalCurriculumInsightsHubQuery).not.toContain(
      "links[defined(subject->_id)]",
    );
  });

  it("resolves editorial videos and their transcripts through Sanity", () => {
    expect(nationalCurriculumInsightsHubQuery).toContain('"video": video->');
    expect(nationalCurriculumInsightsHubQuery).toContain("playbackId");
    expect(nationalCurriculumInsightsHubQuery).toContain(
      '"transcript": transcript',
    );
  });
  it("reads the editorial header date without deriving it from document updates", async () => {
    const hero = {
      __typename: "NationalCurriculumInsightsHeaderSection",
      heading: "Changes to the national curriculum: science",
      bodyPortableText: moduleFixture.contentPortableText,
      lastUpdatedAt: "2026-09-10",
    };
    mockFetch.mockResolvedValueOnce({ ...subjectFixture, modules: [hero] });

    const subject = await getNationalCurriculumInsightsSubjectBySlug("science");

    expect(subject?.modules).toEqual([hero]);
    expect(nationalCurriculumInsightsSubjectBySlugQuery).toContain(
      "lastUpdatedAt,",
    );
  });

  it("accepts headers without an editorial date", async () => {
    mockFetch.mockResolvedValueOnce({
      ...subjectFixture,
      modules: [
        {
          __typename: "NationalCurriculumInsightsHeaderSection",
          heading: "Changes to the national curriculum: science",
          bodyPortableText: moduleFixture.contentPortableText,
          lastUpdatedAt: null,
        },
      ],
    });
    await expect(
      getNationalCurriculumInsightsSubjectBySlug("science"),
    ).resolves.not.toBeNull();
  });

  it("rejects an invalid editorial date", async () => {
    mockFetch.mockResolvedValueOnce({
      ...subjectFixture,
      modules: [
        {
          __typename: "NationalCurriculumInsightsHeaderSection",
          heading: "Changes to the national curriculum: science",
          bodyPortableText: moduleFixture.contentPortableText,
          lastUpdatedAt: "2026-02-30",
        },
      ],
    });
    await expect(
      getNationalCurriculumInsightsSubjectBySlug("science"),
    ).rejects.toThrow();
  });
  it("keeps phase links in the page's perspective and filters unavailable destinations", () => {
    expect(nationalCurriculumInsightsHubQuery).toContain(
      "defined(subject->_id) && phase in subject->tabs[defined(page->_id)].kind",
    );
    expect(nationalCurriculumInsightsHubQuery).toContain(
      '"subjectSlug": subject->slug.current',
    );
  });

  it.each([
    { phaseLinks: [] },
    {
      phaseLinks: [
        {
          title: "Science",
          subjectSlug: "science",
          phase: "primary",
          iconName: null,
        },
      ],
    },
  ])(
    "reads the configured phase links: $phaseLinks",
    async ({ phaseLinks }) => {
      mockFetch.mockResolvedValueOnce({ ...hubFixture, phaseLinks });
      const result = await getNationalCurriculumInsightsHub();
      expect(result?.phaseLinks?.[0]?.subjectSlug).toBe(
        phaseLinks[0] ? "science" : undefined,
      );
    },
  );

  it.each([
    nationalCurriculumInsightsHubQuery,
    nationalCurriculumInsightsGuidancePageQuery,
    nationalCurriculumInsightsSubjectBySlugQuery,
  ])(
    "resolves subject overview links using the page's document perspective",
    (query) => {
      expect(query).toContain("subjectOverviewLinks[defined(subject->_id)]");
      expect(query).toContain('"subjectSlug": subject->slug.current');
    },
  );
  it.each([
    nationalCurriculumInsightsHubQuery,
    nationalCurriculumInsightsGuidancePageQuery,
    nationalCurriculumInsightsSubjectBySlugQuery,
  ])("resolves internal links in every module's rich text", (query) => {
    for (const field of [
      "body",
      "content",
      "introduction",
      "privacyText",
      "answer",
      "transcript",
    ]) {
      expect(query).toContain(`${field}${insightsPortableTextProjection}`);
    }
    expect(insightsPortableTextProjection).toContain(
      '"reference": reference->{',
    );
    expect(insightsPortableTextProjection).toContain('"contentType": _type');
    expect(insightsPortableTextProjection).toContain('"slug": slug.current');
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

  it("reads the nested headline quote without changing standalone quote sections", async () => {
    const quote = {
      quote: "Clearer progression for pupils.",
      attribution: "Science subject lead",
      role: "Science Subject Lead",
      image: {
        asset: {
          _id: "image-portrait-1000x1000-png",
          url: "https://example.com/portrait.png",
        },
        isPresentational: true,
      },
    };
    const overview = {
      __typename: "NationalCurriculumInsightsOverviewSection",
      heading: "The headlines in 60 seconds",
      bodyPortableText: moduleFixture.contentPortableText,
      quote,
    };
    const standaloneQuote = {
      __typename: "NationalCurriculumInsightsQuoteSection",
      ...quote,
    };
    mockFetch.mockResolvedValueOnce({
      ...subjectFixture,
      modules: [overview, standaloneQuote],
    });

    const result = await getNationalCurriculumInsightsSubjectBySlug("science");
    expect(result?.modules).toEqual([overview, standaloneQuote]);
    expect(nationalCurriculumInsightsSubjectBySlugQuery).toContain(
      '"quote": select(',
    );
    expect(nationalCurriculumInsightsSubjectBySlugQuery).toContain(
      '_type == "nationalCurriculumInsightsOverviewSection" => quote{',
    );
  });

  it.each([undefined, null])(
    "accepts an existing headline panel without a nested quote",
    async (quote) => {
      mockFetch.mockResolvedValueOnce({
        ...subjectFixture,
        modules: [
          {
            __typename: "NationalCurriculumInsightsOverviewSection",
            heading: "Summary",
            bodyPortableText: moduleFixture.contentPortableText,
            quote,
          },
        ],
      });
      const result =
        await getNationalCurriculumInsightsSubjectBySlug("science");
      expect(result?.modules[0]?.__typename).toBe(
        "NationalCurriculumInsightsOverviewSection",
      );
    },
  );

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
