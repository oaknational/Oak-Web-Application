import { screen, within } from "@testing-library/react";

import { localNationalCurriculumInsightsFixtures } from "../__fixtures__/nationalCurriculumInsights";
import { getNationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsView } from "./View";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";

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

  return data;
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
    const navigation = screen.getByRole("navigation", {
      name: "Science insights",
    });
    expect(
      within(navigation).getByRole("link", {
        name: "Science changes overview",
      }),
    ).toHaveAttribute("href", "/curriculum-change-explained/science");
    expect(
      within(navigation).getByRole("link", { name: "Science Primary changes" }),
    ).toHaveAttribute("href", "/curriculum-change-explained/science/primary");
    expect(
      within(navigation).queryByRole("link", { name: /KS[1-4]/ }),
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
      __typename: "NationalCurriculumInsightsChecklistSection",
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
      __typename: "NationalCurriculumInsightsPreparationSection",
      heading: "Prepare for the changes",
      steps: [
        { id: "one", text: "Map the current curriculum." },
        { id: "two", text: "Plan the progression." },
        { id: "three", text: "Choose a local study." },
      ],
      attribution: "Emma McCrea",
      role: "Head of Curriculum Design",
      image: null,
    });
    renderWithTheme(<NationalCurriculumInsightsView data={data} />);
    expect(
      screen.getByRole("heading", { name: "Prepare for the changes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Emma McCrea")).toBeInTheDocument();
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
      within(primarySubjects).getByRole("link", { name: "Science" }),
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
    ).toBeInTheDocument();

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

  it("selects the Primary tab and renders Primary page content", async () => {
    renderWithTheme(
      <NationalCurriculumInsightsView
        data={await getData(["science", "primary"])}
      />,
    );

    expect(
      screen.queryByRole("navigation", { name: "Science insights" }),
    ).toBeInTheDocument();
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

  it("renders key-stage navigation and the independently editable key-stage page", async () => {
    renderWithTheme(
      <NationalCurriculumInsightsView
        data={await getData(["science", "primary", "key-stage-1"])}
      />,
    );

    expect(
      screen.queryByRole("navigation", { name: "Science insights" }),
    ).toBeInTheDocument();
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
          linkLabel: "Read insights",
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
        cards: [
          {
            heading: "A conversation about science",
            description: "Hear from curriculum experts.",
            image: hero.image ?? {
              altText: null,
              asset: null,
              hotspot: null,
              isPresentational: true,
            },
            videoUrl: "https://example.com/science-video",
            duration: "12 mins",
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
    ).toHaveAttribute("href", "https://example.com/science-video");
    expect(container).toHaveTextContent(
      "The changes create a clearer learning journey.",
    );
  });
});
