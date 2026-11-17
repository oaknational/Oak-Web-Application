import { screen } from "@testing-library/react";

import { hubData, storyPortableText } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsImageText } from "./ImageText";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

jest.mock("@/components/SharedComponents/VideoPlayer", () => ({
  __esModule: true,
  default: ({ title, playbackId }: { title: string; playbackId: string }) => (
    <button data-playback-id={playbackId}>Play {title}</button>
  ),
}));

it("plays the selected Oak video without requiring an image", () => {
  const section = {
    __typename: "NationalCurriculumInsightsImageTextSection" as const,
    heading: "Get ready for curriculum change with Oak",
    bodyPortableText: storyPortableText("Prepare for the new curriculum."),
    background: "green" as const,
    imagePosition: "right" as const,
    image: null,
    video: {
      title: "Curriculum change explained",
      video: {
        asset: {
          assetId: "approved-asset",
          playbackId: "approved-playback",
          thumbTime: null,
        },
      },
      transcript: storyPortableText("The approved transcript"),
    },
  };
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse(section).success,
  ).toBe(true);
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse({
      ...section,
      video: null,
    }).success,
  ).toBe(false);
  renderWithTheme(
    <NationalCurriculumInsightsImageText data={hubData} section={section} />,
  );
  const player = screen.getByRole("button", {
    name: "Play Curriculum change explained",
  });
  expect(player).toHaveAttribute("data-playback-id", "approved-playback");
  expect(player.closest('[aria-hidden="true"]')).toBeNull();
  expect(screen.getByRole("heading", { name: section.heading })).toBeVisible();
});
