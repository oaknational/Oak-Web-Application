import { screen, within } from "@testing-library/react";

import { NationalCurriculumInsightsView } from "./NationalCurriculumInsightsView";
import {
  getNationalCurriculumInsightsRouteData,
  localNationalCurriculumInsightsFixtures,
} from "./getNationalCurriculumInsightsData";

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
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary",
    );
  });

  it("does not render tab navigation unless the editor adds the module", async () => {
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
      overviewLabel: "changes overview",
      primaryLabel: "Primary",
      secondaryLabel: "Secondary",
    });
    rerender(<NationalCurriculumInsightsView data={data} />);

    const navigation = screen.getByRole("navigation", {
      name: "Science insights",
    });
    expect(navigation).toContainElement(
      screen.getByRole("link", { name: "Science changes overview" }),
    );
    expect(
      screen.getByRole("link", { name: "Science Primary changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary",
    );
  });

  it("selects the Primary tab and renders Primary page content", async () => {
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

  it("renders key-stage navigation and the independently editable key-stage page", async () => {
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
          linkLabel: "Read insights",
        },
      ],
    });

    renderWithTheme(<NationalCurriculumInsightsView data={data} />);

    expect(
      screen.getByRole("link", { name: /Changes to science in key stage 1/ }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary/key-stage-1",
    );
  });

  it("renders the editorial, video and quote modules", async () => {
    const data = await getData();
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
