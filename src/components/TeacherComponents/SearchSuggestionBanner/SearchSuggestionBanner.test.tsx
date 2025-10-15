import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";

import { SearchSuggestionBanner } from "./SearchSuggestionBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SearchIntent } from "@/common-lib/schemas/search-intent";
import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";

const searchIntent: SearchIntent = {
  directMatch: {
    subject: { slug: "maths", title: "Maths" },
    keyStage: { slug: "ks2", title: "Key stage 2" },
    examBoard: null,
    year: null,
  },
  suggestedFilters: [],
};
const mathsDescription = OAK_SUBJECTS.find(
  (s) => s.slug == "maths",
)?.description;

const trackingData = {
  searchFilterOptionSelected: [],
  searchResultCount: 100,
};

const mockSearchResultOpened = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      searchResultOpened: (...args: unknown[]) =>
        mockSearchResultOpened(...args),
    },
  }),
}));

// Mock oak link and prevent default on click so it doesn't attempt to navigate
jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  OakLink: (args: {
    href: string;
    children: ReactNode;
    onClick: () => void;
  }) => (
    <a
      href={args.href}
      onClick={(e) => {
        e.preventDefault();
        args.onClick();
      }}
    >
      {args.children}
    </a>
  ),
}));

const render = renderWithProviders();
describe("SearchSuggestionBanner", () => {
  it("renders a heading", () => {
    render(
      <SearchSuggestionBanner
        intent={searchIntent}
        searchTrackingData={trackingData}
      />,
    );
    const heading = screen.getByText("Maths");
    expect(heading).toBeInTheDocument();
  });
  it("renders metadata when there is a direct keystage match", () => {
    render(
      <SearchSuggestionBanner
        intent={searchIntent}
        searchTrackingData={trackingData}
      />,
    );
    const metadata = screen.getByText("Key stage 2", { selector: "p" });
    expect(metadata).toBeInTheDocument();
  });
  it("renders a description when it exists", () => {
    render(
      <SearchSuggestionBanner
        intent={searchIntent}
        searchTrackingData={trackingData}
      />,
    );
    if (!mathsDescription) throw new Error("Missing maths description ");
    const description = screen.getByText(mathsDescription);
    expect(description).toBeInTheDocument();
  });
  it("renders the correct link when there is only one", () => {
    render(
      <SearchSuggestionBanner
        intent={searchIntent}
        searchTrackingData={trackingData}
      />,
    );
    const link = screen.getByText("Key stage 2", { selector: "a" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks2/subjects/maths/programmes",
    );
  });
  it("renders multiple links when there are suggested ks filters", () => {
    render(
      <SearchSuggestionBanner
        searchTrackingData={trackingData}
        intent={{
          directMatch: {
            subject: { slug: "maths", title: "Maths" },
            keyStage: null,
            examBoard: null,
            year: null,
          },
          suggestedFilters: [
            {
              title: "Key stage 2",
              slug: "ks2",
              type: "key-stage",
            },
            {
              title: "Key stage 4",
              slug: "ks4",
              type: "key-stage",
            },
          ],
        }}
      />,
    );
    const ks2Link = screen.getByText("Key stage 2", { selector: "a" });
    expect(ks2Link).toBeInTheDocument();
    expect(ks2Link).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks2/subjects/maths/programmes",
    );

    const ks4Link = screen.getByText("Key stage 4", { selector: "a" });
    expect(ks4Link).toBeInTheDocument();
    expect(ks4Link).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks4/subjects/maths/programmes",
    );
  });
  it("calls searchResultOpened on keystage link click", async () => {
    render(
      <SearchSuggestionBanner
        intent={searchIntent}
        searchTrackingData={trackingData}
      />,
    );
    const link = screen.getByText("Key stage 2", { selector: "a" });
    if (!link) throw new Error("Could not find keystage link");
    const user = userEvent.setup();
    await user.click(link);
    expect(mockSearchResultOpened).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      context: "search",
      keyStageSlug: "ks2",
      keyStageTitle: "Key stage 2",
      lessonName: null,
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: "",
      lessonSlug: null,
      searchFilterOptionSelected: [],
      searchRank: 1,
      searchResultCount: 100,
      searchResultType: "suggestion",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitName: null,
      unitSlug: null,
    });
  });
});
