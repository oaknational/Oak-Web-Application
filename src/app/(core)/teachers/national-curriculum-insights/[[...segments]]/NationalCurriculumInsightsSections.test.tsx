import { fireEvent, screen } from "@testing-library/react";

import { NationalCurriculumInsightsHero } from "./NationalCurriculumInsightsHero";
import {
  NationalCurriculumInsightsFaq,
  NationalCurriculumInsightsImageText,
  NationalCurriculumInsightsKeyStageCards,
  NationalCurriculumInsightsNewsletter,
  NationalCurriculumInsightsOverview,
  NationalCurriculumInsightsPhaseCards,
  NationalCurriculumInsightsPromotionalHeading,
  NationalCurriculumInsightsQuote,
  NationalCurriculumInsightsRichText,
  NationalCurriculumInsightsSubjectNavigation,
  NationalCurriculumInsightsTable,
  NationalCurriculumInsightsVideoCards,
} from "./NationalCurriculumInsightsSections";
import {
  getNationalCurriculumInsightsRouteData,
  localNationalCurriculumInsightsFixtures,
} from "./getNationalCurriculumInsightsData";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import type {
  NationalCurriculumInsightsHeroSection,
  NationalCurriculumInsightsModule,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";

const portableText = (key: string, text: string) => [
  {
    _key: `${key}-block`,
    _type: "block",
    children: [
      {
        _key: `${key}-span`,
        _type: "span",
        marks: [],
        text,
      },
    ],
    markDefs: [],
    style: "normal",
  },
];

const localImage = {
  altText: null,
  asset: null,
  hotspot: null,
  isPresentational: true,
};

const contentImage = {
  altText: "A teacher discussing the curriculum",
  asset: {
    _id: "image-example",
    url: "https://cdn.sanity.io/images/cuvjke51/feat-national-curriculum-insights/example-100x100.png",
  },
  hotspot: null,
  isPresentational: false,
};

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

const moduleOf = <T extends NationalCurriculumInsightsModule["__typename"]>(
  module: Extract<NationalCurriculumInsightsModule, { __typename: T }>,
) => module;

describe("National Curriculum Insights sections", () => {
  it("renders the configurable editorial, media, table and form sections", async () => {
    const data = await getData();
    const body = portableText("section", "Editable section copy.");

    const { container } = renderWithTheme(
      <>
        <NationalCurriculumInsightsOverview
          data={data}
          section={moduleOf({
            __typename: "NationalCurriculumInsightsOverviewSection",
            heading: "Curriculum overview",
            bodyPortableText: body,
            image: contentImage,
          })}
        />
        <NationalCurriculumInsightsPromotionalHeading
          section={moduleOf({
            __typename: "NationalCurriculumInsightsPromotionalHeadingSection",
            heading: "A clearer curriculum",
          })}
        />
        <NationalCurriculumInsightsImageText
          section={moduleOf({
            __typename: "NationalCurriculumInsightsImageTextSection",
            heading: "What is changing",
            bodyPortableText: body,
            image: contentImage,
            imagePosition: "right",
            background: "yellow",
            ctaLabel: "Read the details",
            ctaHref: "/teachers",
          })}
        />
        <NationalCurriculumInsightsImageText
          section={moduleOf({
            __typename: "NationalCurriculumInsightsImageTextSection",
            heading: "How it helps",
            bodyPortableText: body,
            image: localImage,
            imagePosition: "left",
            background: "white",
            ctaLabel: null,
            ctaHref: null,
          })}
        />
        <NationalCurriculumInsightsVideoCards
          section={moduleOf({
            __typename: "NationalCurriculumInsightsVideoCardsSection",
            heading: "Curriculum conversations",
            introductionPortableText: body,
            cards: [
              {
                heading: "Introducing the changes",
                description: "An introduction from the curriculum team.",
                image: contentImage,
                videoUrl: "https://example.com/introduction",
                duration: "12 mins",
              },
              {
                heading: "Planning with the changes",
                description: "How to use the updated curriculum.",
                image: localImage,
                videoUrl: "https://example.com/planning",
                duration: null,
              },
            ],
          })}
        />
        <NationalCurriculumInsightsVideoCards
          section={moduleOf({
            __typename: "NationalCurriculumInsightsVideoCardsSection",
            heading: "One more conversation",
            introductionPortableText: null,
            cards: [
              {
                heading: "A subject conversation",
                description: "A subject specialist explains the changes.",
                image: localImage,
                videoUrl: "https://example.com/subject",
                duration: null,
              },
            ],
          })}
        />
        <NationalCurriculumInsightsQuote
          section={moduleOf({
            __typename: "NationalCurriculumInsightsQuoteSection",
            quote: "The new sequence makes progression clearer.",
            attribution: "Curriculum lead",
            role: null,
            image: contentImage,
          })}
        />
        <NationalCurriculumInsightsRichText
          section={moduleOf({
            __typename: "NationalCurriculumInsightsRichTextSection",
            heading: "Further detail",
            headingStyle: "section",
            contentPortableText: body,
          })}
        />
        <NationalCurriculumInsightsTable
          section={moduleOf({
            __typename: "NationalCurriculumInsightsTableSection",
            heading: "At a glance",
            table: {
              rows: [
                { cells: ["Area", "Change"] },
                { cells: ["Knowledge", "Clearer sequencing"] },
              ],
            },
          })}
        />
        <NationalCurriculumInsightsFaq
          data={data}
          section={moduleOf({
            __typename: "NationalCurriculumInsightsFaqSection",
            heading: "Frequently asked questions",
            items: [
              {
                question: "When will the curriculum change?",
                answerPortableText: body,
                initiallyExpanded: true,
              },
              {
                question: "Where can I find support?",
                answerPortableText: body,
                initiallyExpanded: null,
              },
            ],
          })}
        />
        <NationalCurriculumInsightsNewsletter
          section={moduleOf({
            __typename: "NationalCurriculumInsightsNewsletterSection",
            heading: "Keep up to date",
            introduction: "Get curriculum updates by email.",
            benefits: ["New guidance", "Subject updates"],
            illustration: contentImage,
            privacyPortableText: body,
            formId: "curriculum-updates",
            buttonLabel: "Join the mailing list",
          })}
        />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Curriculum overview" }),
    ).toBeInTheDocument();
    container
      .querySelectorAll<HTMLElement>("section[aria-labelledby]")
      .forEach((section) => {
        const headingId = section.getAttribute("aria-labelledby");
        expect(headingId).not.toMatch(/\s/);
        expect(document.getElementById(headingId!)).toBeInTheDocument();
      });
    expect(
      screen.getByRole("link", { name: "Read the details" }),
    ).toHaveAttribute("href", "/teachers");
    expect(
      screen.getByRole("link", { name: /Planning with the changes/ }),
    ).toHaveAttribute("href", "https://example.com/planning");
    expect(screen.getByRole("table")).toHaveTextContent("Clearer sequencing");
    expect(
      screen.getByRole("heading", { name: "Frequently asked questions" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Role"), {
      target: { value: "Teacher" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Join the mailing list" })
        .closest("form")!,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preview only: form submission is disabled.",
    );
  });

  it("uses subject and phase context for navigation cards", async () => {
    const primaryData = await getData(["science", "primary"]);
    const overviewData = await getData(["science"]);
    const hubData = await getData();

    const { rerender } = renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={primaryData}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsPhaseCardsSection",
          cards: [
            {
              phase: "primary",
              heading: "Primary science",
              image: null,
              linkLabel: "Explore Primary",
            },
            {
              phase: "secondary",
              heading: "Secondary science",
              image: contentImage,
              linkLabel: "Explore Secondary",
            },
          ],
        })}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Primary science/ }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary",
    );

    rerender(
      <NationalCurriculumInsightsKeyStageCards
        data={primaryData}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsKeyStageCardsSection",
          cards: [
            {
              keyStage: "KS1",
              heading: "Key stage 1 science",
              image: contentImage,
              linkLabel: "Explore key stage 1",
            },
            {
              keyStage: "KS4",
              heading: "Key stage 4 science",
              image: null,
              linkLabel: "Explore key stage 4",
            },
          ],
        })}
      />,
    );
    expect(
      screen.getByRole("link", { name: /Key stage 1 science/ }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary/key-stage-1",
    );
    expect(
      screen.queryByRole("link", { name: /Key stage 4 science/ }),
    ).not.toBeInTheDocument();

    rerender(
      <NationalCurriculumInsightsSubjectNavigation
        data={primaryData}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsSubjectNavigationSection",
          phases: ["primary", "secondary"],
          primaryHeading: "Primary subjects",
          secondaryHeading: "Secondary subjects",
        })}
      />,
    );
    expect(screen.getByRole("navigation")).toHaveAccessibleName(
      "Explore curriculum changes by subject",
    );
    expect(screen.getByRole("link", { name: "Science" })).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary",
    );
    expect(
      screen.queryByRole("link", { name: "Mathematics" }),
    ).not.toBeInTheDocument();

    rerender(
      <NationalCurriculumInsightsKeyStageCards
        data={overviewData}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsKeyStageCardsSection",
          cards: [
            {
              keyStage: "KS1",
              heading: "Key stage 1 science",
              image: null,
              linkLabel: "Explore key stage 1",
            },
          ],
        })}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(
      <NationalCurriculumInsightsPhaseCards
        data={hubData}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsPhaseCardsSection",
          cards: [
            {
              phase: "primary",
              heading: "Primary science",
              image: null,
              linkLabel: "Explore Primary",
            },
          ],
        })}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders hero metadata and breadcrumbs for every page level", async () => {
    const subjectData = await getData(["science"]);
    const phaseData = await getData(["science", "primary"]);
    const keyStageData = await getData(["science", "primary", "key-stage-1"]);
    const hero: NationalCurriculumInsightsHeroSection = {
      __typename: "NationalCurriculumInsightsHeroSection",
      heading: "Science curriculum changes",
      bodyPortableText: portableText("hero", "The latest curriculum detail."),
      image: localImage,
      authorName: "Curriculum team",
      authorRole: "Subject specialists",
      authorImage: contentImage,
      statusMessage: "Draft guidance",
    };

    const { rerender } = renderWithTheme(
      <NationalCurriculumInsightsHero data={subjectData} section={hero} />,
    );
    expect(screen.getByText("Curriculum team")).toBeInTheDocument();
    expect(screen.getByText("Subject specialists")).toBeInTheDocument();
    expect(screen.getByText("Draft guidance")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /National curriculum insights/ }),
    ).toHaveAttribute("href", "/teachers/national-curriculum-insights");

    rerender(
      <NationalCurriculumInsightsHero
        data={phaseData}
        section={{
          ...hero,
          authorName: null,
          authorRole: null,
          authorImage: null,
        }}
      />,
    );
    expect(screen.queryByText("Curriculum team")).not.toBeInTheDocument();
    expect(screen.getByText("Draft guidance")).toBeInTheDocument();

    rerender(
      <NationalCurriculumInsightsHero
        data={keyStageData}
        section={{ ...hero, statusMessage: null }}
      />,
    );
    expect(screen.getByText("Key stage 1")).toBeInTheDocument();
    expect(screen.queryByText("Draft guidance")).not.toBeInTheDocument();
  });
});
