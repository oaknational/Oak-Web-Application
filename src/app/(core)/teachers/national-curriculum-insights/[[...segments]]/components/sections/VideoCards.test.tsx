import { screen } from "@testing-library/react";

import { NationalCurriculumInsightsVideoCards } from "./VideoCards";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

it("does not restore legacy videos when the selected blog posts are unpublished", () => {
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{
        __typename: "NationalCurriculumInsightsVideoCardsSection",
        heading: "Curriculum conversations",
        posts: [],
        cards: [
          {
            heading: "Retired video",
            description: "Previous preview",
            videoUrl: "https://example.com/video",
            image: {
              asset: null,
              altText: null,
              isPresentational: true,
              hotspot: null,
            },
          },
        ],
      }}
    />,
  );
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  expect(screen.queryByText("Retired video")).not.toBeInTheDocument();
});
