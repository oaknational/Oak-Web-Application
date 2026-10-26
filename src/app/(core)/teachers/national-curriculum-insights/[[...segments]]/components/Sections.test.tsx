import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { localNationalCurriculumInsightsFixtures } from "../__fixtures__/nationalCurriculumInsights";
import {
  INSIGHTS_NEWSLETTER_FORM_ID,
  INSIGHTS_NEWSLETTER_PORTAL_ID,
} from "../helpers/newsletter";
import { getNationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsHeader } from "./InsightHeader";
import { NationalCurriculumInsightsHero } from "./Hero";
import { NationalCurriculumInsightsView } from "./View";
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
} from "./Sections";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import type {
  NationalCurriculumInsightsHeaderSection,
  NationalCurriculumInsightsModule,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import useAnalytics from "@/context/Analytics/useAnalytics";

jest.mock("@/components/GenericPagesComponents/NewsletterForm", () => ({
  useNewsletterForm: jest.fn(),
}));

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/components/SharedComponents/VideoPlayer", () => ({
  __esModule: true,
  default: ({
    title,
    location,
    autoPlay,
  }: {
    title: string;
    location: string;
    autoPlay?: boolean;
  }) => (
    <div
      data-testid="cms-video"
      data-location={location}
      data-autoplay={String(Boolean(autoPlay))}
    >
      {title}
    </div>
  ),
}));

const submitNewsletter = jest.fn();
const newsletterSignUpCompleted = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  submitNewsletter.mockResolvedValue(undefined);
  (useNewsletterForm as jest.Mock).mockReturnValue({
    onSubmit: submitNewsletter,
  });
  (useAnalytics as jest.Mock).mockReturnValue({
    track: { newsletterSignUpCompleted },
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
  it.each([
    { segments: [], background: "#ffffff" },
    { segments: ["guidance"], background: "#ffffff" },
    { segments: ["science"], background: "#fff7cc" },
    { segments: ["science", "primary"], background: "#fff7cc" },
    {
      segments: ["science", "primary", "key-stage-1"],
      background: "#fff7cc",
    },
  ])(
    "uses the newsletter presentation for $segments",
    async ({ segments, background }) => {
      const data = await getData(segments);
      const modules = [
        moduleOf({
          __typename: "NationalCurriculumInsightsNewsletterSection",
          heading: "Keep up to date",
          introduction: "Get curriculum updates by email.",
          benefits: ["New guidance"],
          illustration: contentImage,
          privacyPortableText: portableText(
            "privacy",
            "Read our privacy policy.",
          ),
          buttonLabel: "Join the mailing list",
        }),
      ];
      if (data.route.kind === "hub" && data.hub) {
        data.hub = { ...data.hub, modules };
      } else if (data.page) {
        data.page = { ...data.page, modules };
      } else {
        throw new Error("Expected the page fixture");
      }

      renderWithTheme(<NationalCurriculumInsightsView data={data} />);

      expect(
        screen.getByRole("region", { name: "Keep up to date" }),
      ).toHaveStyle({ background });
      expect(screen.getByText("Get curriculum updates by email.")).toHaveStyle({
        fontSize: "1.125rem",
        fontWeight: "300",
      });
    },
  );

  it.each([undefined, ["guidance"], ["science", "primary"]])(
    "keeps joined FAQ rows independently expandable on route %j",
    async (segments) => {
      const user = userEvent.setup();
      const data = await getData(segments);

      renderWithTheme(
        <NationalCurriculumInsightsFaq
          data={data}
          section={moduleOf({
            __typename: "NationalCurriculumInsightsFaqSection",
            heading: "Frequently asked questions",
            items: [
              {
                question: "When will the curriculum change?",
                answerPortableText: portableText("timing", "The timetable."),
              },
              {
                question: "Where can I find support?",
                answerPortableText: portableText("support", "Our guidance."),
              },
            ],
          })}
        />,
      );

      expect(screen.getAllByTestId("faq-divider")).toHaveLength(3);

      const [firstQuestion, secondQuestion] = screen.getAllByRole("button");
      expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
      expect(secondQuestion).toHaveAttribute("aria-expanded", "false");
      expect(screen.getByText("The timetable.")).toBeVisible();
      expect(screen.getByText("Our guidance.")).not.toBeVisible();

      await user.click(secondQuestion!);
      expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
      expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText("Our guidance.")).toBeVisible();
      expect(
        screen.getByRole("heading", { name: "Where can I find support?" }),
      ).toHaveStyle({ textAlign: "left" });

      await user.keyboard("{Enter}");
      expect(secondQuestion).toHaveAttribute("aria-expanded", "false");
      expect(firstQuestion).toHaveAttribute("aria-expanded", "true");

      await user.click(firstQuestion!);
      expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
      expect(screen.getByText("The timetable.")).not.toBeVisible();
      await user.keyboard(" ");
      expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    },
  );

  it("starts an inline video separately from the blog link", async () => {
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
        })}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const blogLink = screen.getByRole("link", {
      name: /Bennie Kara on inclusive curriculum leadership/,
    });
    expect(blogLink).toHaveAttribute(
      "href",
      "/blog/curriculum-conversations-episode-3",
    );
    expect(screen.queryByTestId("cms-video")).not.toBeInTheDocument();
    await userEvent.setup().click(
      screen.getByRole("button", {
        name: "Play Bennie Kara on inclusive curriculum leadership",
      }),
    );
    expect(blogLink).not.toContainElement(screen.getByTestId("cms-video"));

    expect(screen.getByTestId("cms-video")).toHaveTextContent(
      "Bennie Kara on inclusive curriculum leadership",
    );
    expect(screen.getByTestId("guidance-inline-video")).toContainElement(
      screen.getByTestId("cms-video"),
    );
    expect(screen.getByTestId("cms-video")).toHaveAttribute(
      "data-location",
      "blog",
    );
    expect(screen.getByTestId("cms-video")).toHaveAttribute(
      "data-autoplay",
      "true",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the header illustration out of the subject headline panel", async () => {
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
      screen.getByRole("region", { name: "Science overview" }),
    ).toHaveStyle({ display: "flex", "background-color": "#ffffff" });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Science copy.")).toBeInTheDocument();
  });

  it("renders the configurable editorial, media, table and form sections", async () => {
    const user = userEvent.setup();
    const data = await getData();
    const body = portableText("section", "Editable section copy.");

    const { container } = renderWithTheme(
      <>
        <NationalCurriculumInsightsOverview
          data={await getData(["science"])}
          section={moduleOf({
            __typename: "NationalCurriculumInsightsOverviewSection",
            heading: "Curriculum overview",
            bodyPortableText: body,
          })}
        />
        <NationalCurriculumInsightsPromotionalHeading
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
            posts: [
              {
                id: "introduction",
                slug: "introduction",
                title: "Introducing the changes",
                summary: "An introduction from the curriculum team.",
                image: contentImage,
              },
              {
                id: "planning",
                slug: "planning",
                title: "Planning with the changes",
                summary: "How to use the updated curriculum.",
                image: localImage,
              },
            ],
          })}
        />
        <NationalCurriculumInsightsVideoCards
          section={moduleOf({
            __typename: "NationalCurriculumInsightsVideoCardsSection",
            heading: "One more conversation",
            introductionPortableText: null,
            posts: [
              {
                id: "subject",
                slug: "subject",
                title: "A subject conversation",
                summary: "A subject specialist explains the changes.",
                image: localImage,
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
          variant="plain"
          section={moduleOf({
            __typename: "NationalCurriculumInsightsNewsletterSection",
            heading: "Keep up to date",
            introduction: "Get curriculum updates by email.",
            benefits: ["New guidance", "Subject updates"],
            illustration: contentImage,
            privacyPortableText: body,
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
    ).toHaveAttribute("href", "/blog/planning");
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
    expect(
      screen.getByRole("heading", { name: "When will the curriculum change?" }),
    ).toHaveStyle({ textAlign: "left" });

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(useNewsletterForm).toHaveBeenCalledWith({
      hubspotNewsletterFormId: INSIGHTS_NEWSLETTER_FORM_ID,
      hubspotPortalId: INSIGHTS_NEWSLETTER_PORTAL_ID,
    });

    const newsletterForm = screen
      .getByRole("button", { name: "Join the mailing list" })
      .closest("form")!;
    expect(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    ).toHaveStyle({
      "border-radius": "0rem",
      width: "1.5rem",
      height: "1.5rem",
    });
    expect(
      screen.getByText("New guidance").compareDocumentPosition(newsletterForm) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.change(screen.getByRole("textbox", { name: /Name/ }), {
      target: { value: "Jamie Maxwell" },
    });
    expect(screen.getByTestId("search-combobox-input")).toHaveAttribute(
      "placeholder",
      "Type your school or organisation",
    );
    const roleSelect = screen.getByRole("combobox", { name: "Role" });
    await user.selectOptions(roleSelect, "Teacher/Subject Specialist");
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
        eduRole: "Subject Specialist",
        schoolName: "",
      });
    });
    expect(newsletterSignUpCompleted).toHaveBeenCalledTimes(1);
    const announcement = await screen.findByRole("status");
    expect(announcement).toHaveAttribute("aria-live", "polite");
    expect(announcement).toHaveAttribute("aria-atomic", "true");
    expect(announcement).toHaveTextContent("Thanks, that's been received");
  });

  it("does not track a completed newsletter signup when HubSpot rejects it", async () => {
    const user = userEvent.setup();
    submitNewsletter.mockRejectedValueOnce(new Error("HubSpot unavailable"));

    renderWithTheme(
      <NationalCurriculumInsightsNewsletter
        variant="highlighted"
        section={moduleOf({
          __typename: "NationalCurriculumInsightsNewsletterSection",
          heading: "Keep up to date",
          introduction: "Get curriculum updates by email.",
          benefits: ["New guidance"],
          illustration: contentImage,
          privacyPortableText: portableText(
            "newsletter-privacy",
            "Read our privacy policy.",
          ),
          buttonLabel: "Join the mailing list",
        })}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: /Name/ }), "Jamie");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Role" }),
      "Teacher/Subject Specialist",
    );
    await user.type(
      screen.getByRole("textbox", { name: /Email/ }),
      "jamie@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: "Join the mailing list" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We couldn't submit the form. Please try again.",
    );
    expect(newsletterSignUpCompleted).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
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
          mobileHeading: "This term, you’ll find:",
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
    expect(screen.getByTestId("guidance-status-clock")).toBeInTheDocument();
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(
      screen.getByRole("img", { name: "A teacher discussing the curriculum" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("guidance-status-clock").querySelector("img"),
    ).toHaveAttribute("alt", "");
    expect(
      screen.getByTestId("guidance-status-clock").querySelector("img"),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("/v1789035961/icons/clock.svg"),
    );
  });

  it("uses the CMS portrait without overriding it based on the author's name", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsQuote
        section={moduleOf({
          __typename: "NationalCurriculumInsightsQuoteSection",
          quote: "Teachers must be supported to adopt our recommendations.",
          attribution: "Professor Becky Francis CBE",
          role: "Chair of the Curriculum and Assessment Review",
          image: contentImage,
        })}
      />,
    );

    const portrait = container.querySelector(
      '[data-insights-module="guidance-testimonial"] img',
    );
    expect(portrait).toHaveAttribute(
      "src",
      expect.stringContaining("example-100x100.png"),
    );
    expect(portrait).toHaveAttribute("alt", "");
  });

  it("keeps the paragraph break in the guidance quote", () => {
    renderWithTheme(
      <NationalCurriculumInsightsQuote
        section={moduleOf({
          __typename: "NationalCurriculumInsightsQuoteSection",
          quote: "A refreshed curriculum.\n\nSupport for teachers.",
          attribution: "Professor Becky Francis CBE",
        })}
      />,
    );

    expect(screen.getByText("“A refreshed curriculum.")).toBeInTheDocument();
    expect(screen.getByText("Support for teachers.”")).toBeInTheDocument();
  });

  it("uses the CMS benefits artwork and mirror setting without overriding editor-selected images", async () => {
    const data = await getData(["guidance"]);
    const section = moduleOf({
      __typename: "NationalCurriculumInsightsImageTextSection",
      heading: "Curriculum resources",
      bodyPortableText: portableText("benefits", "Resources for your school."),
      image: {
        ...contentImage,
        asset: {
          ...contentImage.asset,
          url: "https://cdn.sanity.io/images/cuvjke51/feat-national-curriculum-insights/96af3d15e4488bc498ead83aa83a815229709f43-513x400.png",
        },
      },
      imagePosition: "right",
      mirrorImage: true,
      background: "turquoise",
    });
    const { rerender } = renderWithTheme(
      <NationalCurriculumInsightsImageText data={data} section={section} />,
    );
    expect(screen.getByAltText(contentImage.altText)).toHaveAttribute(
      "src",
      expect.stringContaining(
        "96af3d15e4488bc498ead83aa83a815229709f43-513x400.png",
      ),
    );
    rerender(
      <NationalCurriculumInsightsImageText
        data={data}
        section={{ ...section, image: contentImage }}
      />,
    );
    expect(screen.getByAltText(contentImage.altText)).toHaveAttribute(
      "src",
      expect.stringContaining("example-100x100.png"),
    );
  });

  it("keeps the full hub illustration visible", async () => {
    const data = await getData();
    const section = data.hub?.modules.find(
      (module) => module.__typename === "NationalCurriculumInsightsHeroSection",
    );
    if (!section) throw new Error("Expected a hub hero");
    renderWithTheme(
      <NationalCurriculumInsightsHero data={data} section={section} />,
    );
    const image = screen
      .getByTestId("national-curriculum-insights-hero")
      .querySelector("img");
    expect(image).toHaveStyle({ objectFit: "contain" });
  });

  it.each(["left", "right"] as const)(
    "puts the editorial heading before the %s image on small screens",
    async (imagePosition) => {
      const data = await getData();
      renderWithTheme(
        <NationalCurriculumInsightsImageText
          data={data}
          section={moduleOf({
            __typename: "NationalCurriculumInsightsImageTextSection",
            heading: "Prepare with confidence using Oak",
            bodyPortableText: portableText(
              "confidence",
              "Resources for your school.",
            ),
            image: contentImage,
            imagePosition,
            background: "green",
          })}
        />,
      );
      const heading = screen.getByRole("heading").parentElement!;
      const image = screen.getByAltText(contentImage.altText).parentElement!
        .parentElement!.parentElement!;
      const body = screen
        .getByText("Resources for your school.")
        .closest("p")!.parentElement!;
      expect(heading).toHaveStyle({ order: "0", "grid-column": "span 12" });
      expect(image).toHaveStyle({ order: "1" });
      expect(body).toHaveStyle({ order: "2" });
    },
  );

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
            },
            {
              phase: "secondary",
              heading: "Secondary science",
            },
          ],
        })}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Secondary science/ }),
    ).toHaveAttribute("href", "/curriculum-change-explained/science/secondary");

    rerender(
      <NationalCurriculumInsightsKeyStageCards
        data={primaryData}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsKeyStageCardsSection",
          cards: [
            {
              keyStage: "KS1",
              heading: "Key stage 1 science",
            },
            {
              keyStage: "KS4",
              heading: "Key stage 4 science",
            },
          ],
        })}
      />,
    );
    expect(
      screen.getByRole("link", { name: /Key stage 1 science/ }),
    ).toHaveAttribute(
      "href",
      "/curriculum-change-explained/science/primary/ks1",
    );
    expect(
      screen.queryByRole("link", { name: /Key stage 4 science/ }),
    ).not.toBeInTheDocument();

    rerender(
      <NationalCurriculumInsightsSubjectNavigation
        data={primaryData}
        section={moduleOf({
          __typename: "NationalCurriculumInsightsSubjectNavigationSection",
          heading: "Explore subjects",
          phases: ["primary"],
          primaryHeading: "Primary subjects",
          secondaryHeading: "Secondary subjects",
        })}
      />,
    );
    expect(screen.getByRole("navigation")).toHaveAccessibleName(
      "Primary subjects",
    );
    expect(
      screen.getByRole("link", { name: "Science primary" }),
    ).toHaveAttribute("href", "/curriculum-change-explained/science/primary");
    expect(
      screen.queryByRole("link", { name: "Mathematics secondary" }),
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
            },
          ],
        })}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the editorial date and breadcrumbs for every page level", async () => {
    const subjectData = await getData(["science"]);
    const phaseData = await getData(["science", "primary"]);
    const keyStageData = await getData(["science", "primary", "key-stage-1"]);
    const hero: NationalCurriculumInsightsHeaderSection = {
      __typename: "NationalCurriculumInsightsHeaderSection",
      heading: "Science curriculum changes",
      bodyPortableText: portableText("hero", "The latest curriculum detail."),
      lastUpdatedAt: "2026-09-10",
    };

    const { rerender } = renderWithTheme(
      <NationalCurriculumInsightsHeader data={subjectData} section={hero} />,
    );
    expect(screen.getByText("10 September 2026")).toHaveAttribute(
      "datetime",
      "2026-09-10",
    );
    expect(
      screen.getByRole("link", { name: /National curriculum insights/ }),
    ).toHaveAttribute("href", "/curriculum-change-explained");

    rerender(
      <NationalCurriculumInsightsHeader data={phaseData} section={hero} />,
    );
    expect(screen.getByText("10 September 2026")).toBeInTheDocument();

    rerender(
      <NationalCurriculumInsightsHeader data={keyStageData} section={hero} />,
    );
    expect(screen.getByText("KS1")).toBeInTheDocument();
  });
});
