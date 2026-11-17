import { screen, within } from "@testing-library/react";

import { localNationalCurriculumInsightsFixtures } from "../__fixtures__/nationalCurriculumInsights";
import { getNationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsView } from "./View";

import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const getData = async (segments?: string[]) => {
  const route = parseNationalCurriculumInsightsRoute(segments);
  if (!route) {
    throw new Error("Expected a valid route");
  }

  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode: false,
    reader: localNationalCurriculumInsightsFixtures.reader,
  });
  if (!data) {
    throw new Error("Expected local fixture data");
  }

  return JSON.parse(JSON.stringify(data)) as typeof data;
};

describe("NationalCurriculumInsightsView", () => {
  it("renders phase-page key-stage cards before the phase-grouped subject links", async () => {
    const routeData = await getData(["science", "primary"]);
    const data = { ...routeData, page: { ...routeData.page! } };
    const page = data.page!;
    page.modules = [
      {
        __typename: "NationalCurriculumInsightsKeyStageCardsSection",
        cards: [
          { keyStage: "KS1", heading: "KS1 Science curriculum changes" },
          { keyStage: "KS2", heading: "KS2 Science curriculum changes" },
        ],
      },
      {
        __typename: "NationalCurriculumInsightsSubjectNavigationSection",
        heading: "See what's changing in your subject",
        phases: ["primary", "secondary"],
        primaryHeading: "Primary",
        secondaryHeading: "Secondary",
      },
    ];
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsView data={data} />,
    );
    expect(
      screen.getByRole("link", { name: "KS1 Science curriculum changes" }),
    ).toHaveAttribute(
      "href",
      "/curriculum-change-explained/science/primary/ks1",
    );
    expect(
      screen.getByRole("link", { name: "KS2 Science curriculum changes" }),
    ).toHaveAttribute(
      "href",
      "/curriculum-change-explained/science/primary/ks2",
    );
    for (const phase of ["Primary", "Secondary"]) {
      expect(
        screen.getByRole("navigation", {
          name: phase,
        }),
      ).toBeVisible();
    }
    expect(
      Array.from(container.querySelectorAll("[data-insights-module]")).map(
        (element) => element.getAttribute("data-insights-module"),
      ),
    ).toEqual(["key-stage-cards", "subject-phase-chips"]);
  });

  it("links full phase pages to the available subject phases without inventing key stages", async () => {
    const data = await getData(["science", "primary"]);
    data.subject = {
      ...data.subject!,
      tabs: data.subject!.tabs.map((tab) => ({
        ...tab,
        page: { ...tab.page, keyStages: [] },
      })),
    };
    renderWithTheme(<NationalCurriculumInsightsView data={data} />);
    expect(
      screen.queryByRole("navigation", { name: "Science insights" }),
    ).not.toBeInTheDocument();
  });
  it("uses one shared hub download configuration on a subject page", async () => {
    const data = await getData(["science"]);
    data.hub = {
      ...data.hub!,
      modules: [
        ...data.hub!.modules,
        {
          __typename: "NationalCurriculumInsightsDownloadSection",
          barHeading: "Planning with your team?",
          barCtaLabel: "Download this guidance.",
          detailsHeading: "Your details",
          downloadsHeading: "Choose guidance",
          downloadsIntroduction: "Select your subjects.",
          downloadButtonLabel: "Download",
        },
      ],
    };
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsView data={data} />,
    );
    expect(
      container.querySelectorAll('[data-insights-module="downloads"]'),
    ).toHaveLength(1);
    expect(
      screen.getByRole("button", {
        name: "Planning with your team? Download this guidance.",
      }),
    ).toBeInTheDocument();
  });

  it("uses fixed links for the populated article sections", async () => {
    const data = await getData(["science", "primary", "key-stage-1"]);
    data.page!.modules.push({
      __typename: "NationalCurriculumInsightsArticleSection",
      sections: [
        {
          __typename: "NationalCurriculumInsightsChecklistSection",
          id: "teacher-checklist",
          navigationLabel: "Teacher checklist",
          audience: "teacher",
          heading: "Actions to check for key stage 1",
          items: [
            {
              id: "action",
              contentPortableText: [
                {
                  _type: "block",
                  _key: "action",
                  style: "normal",
                  markDefs: [],
                  children: [
                    {
                      _type: "span",
                      _key: "text",
                      text: "Check the planned sequence.",
                      marks: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    renderWithTheme(<NationalCurriculumInsightsView data={data} />);
    const navigation = screen.getByRole("navigation", {
      name: "KS1 Science sections",
    });
    expect(
      within(navigation).getByRole("link", { name: "Teacher checklist" }),
    ).toBeInTheDocument();
    expect(
      within(navigation).queryByRole("link", {
        name: "School leader checklist",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Actions to check for key stage 1" }),
    ).toBeInTheDocument();
  });
  it.each([
    ["science", "primary"],
    ["science", "primary", "key-stage-1"],
  ])("renders preparation on %s %s %s pages", async (...segments) => {
    const data = await getData(segments);
    if (!data.page) throw new Error("Expected a page");
    data.page.modules.push({
      __typename: "NationalCurriculumInsightsArticleSection",
      sections: [
        {
          __typename: "NationalCurriculumInsightsPreparationSection",
          id: "preparation",
          navigationLabel: "3 steps to get ready",
          heading: "Prepare for the changes",
          steps: [
            { id: "one", text: "Map the current curriculum." },
            { id: "two", text: "Plan the progression." },
            { id: "three", text: "Choose a local study." },
          ],
          attribution: "Emma McCrea",
          role: "Head of Curriculum Design",
          image: null,
        },
        {
          __typename: "NationalCurriculumInsightsConfidenceSection",
          id: "confidence",
          navigationLabel: "Prepare with Oak",
          heading: "Prepare with confidence using Oak",
          bodyPortableText: [],
          cta: {
            label: "Explore curriculum plans",
            linkType: "external",
            external: "https://www.thenational.academy",
          },
        },
      ],
    });
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsView data={data} />,
    );
    expect(
      screen.getByRole("heading", { name: "Prepare for the changes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Emma McCrea")).toBeInTheDocument();
    const article = container.querySelector('[data-insights-module="article"]');
    expect(article).toContainElement(
      screen.getByRole("heading", { name: "Prepare for the changes" }),
    );
    expect(article).toContainElement(
      screen.getByRole("heading", {
        name: "Prepare with confidence using Oak",
      }),
    );
    expect(
      within(
        screen.getByRole("navigation", {
          name: `${segments.length === 3 ? "KS1" : "Primary"} Science sections`,
        }),
      )
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["3 steps to get ready", "Prepare with Oak"]);
  });

  it.each([
    { segments: [] },
    { segments: ["guidance"] },
    { segments: ["science"] },
    { segments: ["science", "primary"] },
  ])("uses the primary text token for $segments", async ({ segments }) => {
    renderWithTheme(
      <NationalCurriculumInsightsView data={await getData(segments)} />,
    );
    expect(screen.getByRole("main")).toHaveStyle({ color: "#222222" });
  });

  it("renders the independently editable hub modules", async () => {
    renderWithTheme(<NationalCurriculumInsightsView data={await getData()} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "National curriculum insights",
      }),
    ).toBeInTheDocument();
    const primarySubjects = screen.getByRole("navigation", {
      name: "Explore Primary curriculum changes",
    });
    expect(
      within(primarySubjects).getByRole("link", { name: "Science primary" }),
    ).toHaveAttribute("href", "/curriculum-change-explained/science/primary");
  });

  it("renders shared tabs once and uses the editable labels when supplied", async () => {
    const data = await getData(["science"]);
    if (!data.page) {
      throw new Error("Expected the Science page fixture");
    }

    const { rerender } = renderWithTheme(
      <NationalCurriculumInsightsView data={data} />,
    );
    expect(
      screen.queryByRole("navigation", { name: "Science insights" }),
    ).not.toBeInTheDocument();

    data.page.modules.push({
      __typename: "NationalCurriculumInsightsPhaseNavigationSection",
      overviewLabel: "curriculum overview",
      primaryLabel: "Primary",
      secondaryLabel: "Secondary",
    });
    rerender(<NationalCurriculumInsightsView data={data} />);

    const navigation = screen.getByRole("navigation", {
      name: "Science insights",
    });
    expect(
      screen.getAllByRole("navigation", { name: "Science insights" }),
    ).toHaveLength(1);
    expect(navigation).toContainElement(
      screen.getByRole("link", { name: "Science curriculum overview" }),
    );
    expect(
      screen.getByRole("link", { name: "Science Primary changes" }),
    ).toHaveAttribute("href", "/curriculum-change-explained/science/primary");
  });

  it("renders Primary page content without adding a tab strip", async () => {
    renderWithTheme(
      <NationalCurriculumInsightsView
        data={await getData(["science", "primary"])}
      />,
    );

    expect(
      screen.queryByRole("navigation", { name: "Science insights" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Primary science curriculum insights",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is independently editable primary content for Science.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the key-stage page without adding a tab strip", async () => {
    renderWithTheme(
      <NationalCurriculumInsightsView
        data={await getData(["science", "primary", "key-stage-1"])}
      />,
    );

    expect(
      screen.queryByRole("navigation", { name: "Science insights" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Science key stage 1 curriculum insights",
      }),
    ).toBeInTheDocument();
  });

  it("links phase cards to the configured child key-stage pages", async () => {
    const data = await getData(["science", "primary"]);
    if (!data.page) {
      throw new Error("Expected the Primary page fixture");
    }
    data.page.modules.push({
      __typename: "NationalCurriculumInsightsKeyStageCardsSection",
      cards: [
        {
          keyStage: "KS1",
          heading: "Changes to science in key stage 1",
        },
      ],
    });

    renderWithTheme(<NationalCurriculumInsightsView data={data} />);

    expect(
      screen.getByRole("link", { name: /Changes to science in key stage 1/ }),
    ).toHaveAttribute(
      "href",
      "/curriculum-change-explained/science/primary/ks1",
    );
  });

  it("renders the editorial, video and quote modules", async () => {
    const data = await getData();
    if (!data.hub) throw new Error("Expected the hub fixture");
    const hero = data.hub.modules.find(
      (module) => module.__typename === "NationalCurriculumInsightsHeroSection",
    );
    if (!hero) {
      throw new Error("Expected the local hub hero fixture");
    }

    data.hub.modules.push(
      {
        __typename: "NationalCurriculumInsightsImageTextSection",
        heading: "How the curriculum is changing",
        bodyPortableText: hero.bodyPortableText,
        image: hero.image ?? {
          altText: null,
          asset: null,
          hotspot: null,
          isPresentational: true,
        },
        imagePosition: "left",
        background: "turquoise",
        ctaLabel: "Read the update",
        ctaHref: "/teachers",
      },
      {
        __typename: "NationalCurriculumInsightsVideoCardsSection",
        heading: "Curriculum conversations",
        introductionPortableText: hero.bodyPortableText,
        posts: [
          {
            id: "science-video",
            slug: "science-video",
            title: "A conversation about science",
            summary: "Hear from curriculum experts.",
            image: hero.image ?? {
              altText: null,
              asset: null,
              hotspot: null,
              isPresentational: true,
            },
          },
        ],
      },
      {
        __typename: "NationalCurriculumInsightsQuoteSection",
        quote: "The changes create a clearer learning journey.",
        attribution: "Curriculum lead",
        role: "Primary school",
        image: null,
      },
    );

    const { container } = renderWithTheme(
      <NationalCurriculumInsightsView data={data} />,
    );

    expect(
      screen.getByRole("heading", { name: "How the curriculum is changing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /A conversation about science/ }),
    ).toHaveAttribute("href", "/blog/science-video");
    expect(container).toHaveTextContent(
      "The changes create a clearer learning journey.",
    );
  });
  it("renders the confidence callout with its curriculum link", async () => {
    const data = await getData(["science", "primary"]);
    data.page!.modules.push({
      __typename: "NationalCurriculumInsightsConfidenceSection",
      heading: "Prepare with confidence using Oak",
      bodyPortableText: [
        {
          _type: "block",
          children: [
            { _type: "span", text: "Explore the current Science plans." },
          ],
        },
      ],
      cta: {
        label: "Explore Science curriculum plans",
        linkType: "external",
        external:
          "https://www.thenational.academy/teachers/curriculum/science-primary/overview",
      },
    });
    renderWithTheme(<NationalCurriculumInsightsView data={data} />);
    expect(
      screen.getByRole("region", { name: "Prepare with confidence using Oak" }),
    ).toHaveTextContent("Explore the current Science plans.");
    expect(
      screen.getByRole("link", { name: "Explore Science curriculum plans" }),
    ).toHaveAttribute(
      "href",
      "https://www.thenational.academy/teachers/curriculum/science-primary/overview",
    );
  });
});
