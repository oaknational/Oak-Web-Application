import { screen, within } from "@testing-library/react";
import { generateOakIconURL } from "@oaknational/oak-components";

import {
  phaseData,
  storyPortableText,
  subjectData,
} from "../__fixtures__/stories";
import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsHeader } from "./InsightHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import type { NationalCurriculumInsightsHeroSection } from "@/common-lib/cms-types/nationalCurriculumInsights";

const section: NationalCurriculumInsightsHeroSection = {
  __typename: "NationalCurriculumInsightsHeroSection",
  heading: "Changes to the national curriculum: science",
  bodyPortableText: storyPortableText("Your guide to the changes."),
  lastUpdatedAt: "2026-09-10",
  authorName: "Legacy byline",
  statusMessage: "Legacy disclaimer",
};

const headerIllustration = () =>
  within(screen.getByTestId("insights-header-illustration")).getByRole(
    "presentation",
  );

const imageSource = (image: HTMLElement) => {
  const url = new URL(image.getAttribute("src")!, "http://localhost");
  return url.searchParams.get("url") ?? url.pathname;
};

describe("NationalCurriculumInsightsHeader", () => {
  it("renders editorial copy and a plain date without the old byline and disclaimer", () => {
    renderWithTheme(
      <NationalCurriculumInsightsHeader data={subjectData} section={section} />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      section.heading,
    );
    expect(screen.getByText("Your guide to the changes.")).toBeInTheDocument();
    expect(screen.getByText("10 September 2026")).toHaveAttribute(
      "datetime",
      "2026-09-10",
    );
    expect(screen.queryByText("Legacy byline")).not.toBeInTheDocument();
    expect(screen.queryByText("Legacy disclaimer")).not.toBeInTheDocument();
  });

  it("does not invent a last-updated date when it has not been set", () => {
    renderWithTheme(
      <NationalCurriculumInsightsHeader
        data={subjectData}
        section={{ ...section, lastUpdatedAt: null }}
      />,
    );

    expect(screen.queryByText(/Last update/)).not.toBeInTheDocument();
  });

  it("uses the editable subject illustration and its alternative text", () => {
    const data: NationalCurriculumInsightsRouteData = {
      ...subjectData,
      subject: {
        ...subjectData.subject!,
        illustration: {
          asset: {
            _id: "image-science-1200x800-png",
            url: "https://example.com/science.png",
          },
          altText: "Science illustration",
          isPresentational: false,
        },
      },
    };
    const { rerender } = renderWithTheme(
      <NationalCurriculumInsightsHeader data={data} section={section} />,
    );
    expect(
      imageSource(screen.getByRole("img", { name: "Science illustration" })),
    ).toBe("https://example.com/science.png");

    rerender(
      <NationalCurriculumInsightsHeader
        data={{
          ...data,
          subject: {
            ...data.subject!,
            illustration: {
              ...data.subject!.illustration!,
              isPresentational: true,
            },
          },
        }}
        section={section}
      />,
    );
    expect(headerIllustration()).toHaveAttribute("alt", "");
  });

  it.each(["primary", "secondary"] as const)(
    "uses the shared %s phase artwork",
    (phase) => {
      renderWithTheme(
        <NationalCurriculumInsightsHeader
          data={{
            ...phaseData,
            route: { kind: "subjectPhase", subjectSlug: "science", phase },
          }}
          section={section}
        />,
      );

      if (phase === "primary") {
        expect(headerIllustration()).toHaveAttribute(
          "src",
          new URL(generateOakIconURL("homepage-three-pupils")).href,
        );
      } else {
        expect(imageSource(headerIllustration())).toBe(
          `/images/curriculum-change-explained/${phase}.svg`,
        );
      }
    },
  );

  it.each([1, 2, 3, 4] as const)(
    "uses the shared KS%s artwork and abbreviated breadcrumb",
    (keyStage) => {
      const phase = keyStage < 3 ? "primary" : "secondary";
      renderWithTheme(
        <NationalCurriculumInsightsHeader
          data={{
            ...phaseData,
            route: {
              kind: "subjectPhaseKeyStage",
              subjectSlug: "science",
              phase,
              keyStageSlug: `key-stage-${keyStage}`,
            },
          }}
          section={section}
        />,
      );

      expect(imageSource(headerIllustration())).toBe(
        `/images/curriculum-change-explained/ks${keyStage}.png`,
      );
      expect(screen.getByText(`KS${keyStage}`)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Science" })).toHaveAttribute(
        "href",
        "/teachers/national-curriculum-insights/science",
      );
      expect(
        screen.getByRole("link", { name: /Primary|Secondary/ }),
      ).toHaveAttribute(
        "href",
        `/teachers/national-curriculum-insights/science/${phase}`,
      );
    },
  );
});
