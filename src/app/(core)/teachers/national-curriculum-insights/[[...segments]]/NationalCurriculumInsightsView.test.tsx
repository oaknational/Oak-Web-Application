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

  it("renders subject tabs after the independently editable page hero", async () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsView data={await getData(["science"])} />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Science insights",
    });
    expect(navigation).toContainElement(
      screen.getByRole("link", { name: "Science changes overview" }),
    );
    expect(
      screen.getByRole("link", { name: "Science changes overview" }),
    ).toHaveAttribute("href", "/teachers/national-curriculum-insights/science");
    expect(
      screen.getByRole("link", { name: "Science Primary changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary",
    );
    expect(
      screen.getByRole("link", { name: "Science Secondary changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/secondary",
    );
    expect(
      navigation.compareDocumentPosition(container.querySelector("h1")!),
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  it("selects the Primary tab and renders Primary page content", async () => {
    renderWithTheme(
      <NationalCurriculumInsightsView
        data={await getData(["science", "primary"])}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: "Primary Science changes overview",
      }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.queryByRole("link", { name: "Science changes overview" }),
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
      screen.getByRole("link", {
        name: "Primary Science changes overview",
      }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary",
    );
    expect(
      screen.getByRole("link", { name: "Science Primary - KS1 changes" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "Science Primary - KS2 changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary/key-stage-2",
    );
    expect(
      screen.queryByRole("link", { name: "Science Primary changes" }),
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
          image: null,
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
        image: hero.image,
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
            image: hero.image,
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
