import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NationalCurriculumInsightsHero } from "./NationalCurriculumInsightsHero";
import {
  NationalCurriculumInsightsFaq,
  NationalCurriculumInsightsGuidanceIntro,
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
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";

jest.mock("@/components/GenericPagesComponents/NewsletterForm", () => ({
  useNewsletterForm: jest.fn(),
}));

jest.mock("@/components/SharedComponents/CMSVideo", () => ({
  __esModule: true,
  default: ({ video }: { video: { title: string } }) => (
    <div data-testid="cms-video">{video.title}</div>
  ),
}));

const submitNewsletter = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useNewsletterForm as jest.Mock).mockReturnValue({
    onSubmit: submitNewsletter,
  });
});

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
  it("renders referenced blog content and opens its video without navigating", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <NationalCurriculumInsightsVideoCards
        section={moduleOf({
          __typename: "NationalCurriculumInsightsVideoCardsSection",
          heading: "Curriculum conversations",
          introductionPortableText: null,
          posts: [
            {
              id: "episode-3",
              title: "Bennie Kara on inclusive curriculum leadership",
              summary: "Explore strong leadership for an inclusive curriculum.",
              slug: "curriculum-conversations-episode-3",
              image: contentImage,
              video: {
                title: "Bennie Kara on inclusive curriculum leadership",
                captions: null,
                transcript: null,
                video: {
                  asset: {
                    assetId: "mux-asset",
                    playbackId: "mux-playback",
                    thumbTime: null,
                  },
                },
              },
            },
          ],
          cards: [
            {
              heading: "Legacy content",
              description: "This should not render when posts are selected.",
              image: contentImage,
              videoUrl: "https://example.com/legacy",
              duration: null,
            },
          ],
        })}
      />,
    );

    expect(screen.queryByText("Legacy content")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", {
        name: "Play Bennie Kara on inclusive curriculum leadership",
      }),
    );

    expect(screen.getByTestId("cms-video")).toHaveTextContent(
      "Bennie Kara on inclusive curriculum leadership",
    );
    expect(
      screen.getByRole("link", { name: "Read the full article" }),
    ).toHaveAttribute("href", "/blog/curriculum-conversations-episode-3");
  });

  it("renders the subject illustration supplied by Sanity", async () => {
    const data = await getData(["science"]);
    if (!data.subject) {
      throw new Error("Expected the Science subject");
    }
    data.subject.illustration = contentImage;

    renderWithTheme(
      <NationalCurriculumInsightsOverview
        data={data}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsOverviewSection",
          heading: "Science overview",
          bodyPortableText: portableText("science-overview", "Science copy."),
        })}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "A teacher discussing the curriculum",
      }),
    ).toHaveAttribute("src", expect.stringContaining("example-100x100.png"));
  });

  it("renders the configurable editorial, media, table and form sections", async () => {
    const user = userEvent.setup();
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
          })}
        />
        <NationalCurriculumInsightsPromotionalHeading
          data={data}
          section={moduleOf({
            __typename: "NationalCurriculumInsightsPromotionalHeadingSection",
            heading: "A clearer curriculum",
          })}
        />
        <NationalCurriculumInsightsImageText
          data={data}
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
          data={data}
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
              },
              {
                question: "Where can I find support?",
                answerPortableText: body,
              },
            ],
          })}
        />
        <NationalCurriculumInsightsNewsletter
          data={data}
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
    expect(
      screen.getByRole("button", {
        name: /When will the curriculum change\?/,
      }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: /Where can I find support\?/ }),
    ).toHaveAttribute("aria-expanded", "false");

    fireEvent.change(screen.getByRole("textbox", { name: /Name/ }), {
      target: { value: "Jamie Maxwell" },
    });
    await user.click(
      screen.getByRole("button", { name: /Role.*Select your role/ }),
    );
    const roleOption = screen
      .getAllByTestId("listbox-option")
      .find(
        (option) =>
          option.getAttribute("data-key") === "Teacher/Subject Specialist",
      );
    if (!roleOption) {
      throw new Error("Expected the teacher role option");
    }
    await user.click(roleOption);
    fireEvent.change(screen.getByRole("textbox", { name: /Email/ }), {
      target: { value: "jamie@example.com" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Join the mailing list" })
        .closest("form")!,
    );
    await waitFor(() => {
      expect(submitNewsletter).toHaveBeenCalledWith({
        name: "Jamie Maxwell",
        email: "jamie@example.com",
        userRole: "",
        eduRole: "Teacher/Subject Specialist",
        schoolName: "",
      });
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Thanks, that's been received",
    );
  });

  it("renders the guidance introduction with its image and status", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsGuidanceIntro
        section={moduleOf({
          __typename: "NationalCurriculumInsightsGuidanceIntroSection",
          heading: "Here, you’ll find:",
          bodyPortableText: portableText(
            "guidance-intro",
            "Practical leadership guidance and curriculum updates.",
          ),
          image: contentImage,
          statusLabel: "Coming soon",
        })}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "This term, you’ll find:" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Practical leadership guidance and curriculum updates."),
    ).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute(
      "alt",
      "A teacher discussing the curriculum",
    );
    expect(images[1]).toHaveAttribute("alt", "");
    expect(images[1]).toHaveAttribute("src", expect.stringContaining("icons"));
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
              linkLabel: "Explore Primary",
            },
            {
              phase: "secondary",
              heading: "Secondary science",
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
              linkLabel: "Explore key stage 1",
            },
            {
              keyStage: "KS4",
              heading: "Key stage 4 science",
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
