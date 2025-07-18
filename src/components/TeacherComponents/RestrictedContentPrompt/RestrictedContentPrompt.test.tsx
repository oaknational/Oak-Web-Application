import { screen } from "@testing-library/react";

import { RestrictedContentPrompt } from "./RestrictedContentPrompt";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockGeorestrictedUser } from "@/__tests__/__helpers__/mockUser";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

describe("RestrictedContentPrompt", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sign in prompt when not geoblocked", () => {
    render(
      <RestrictedContentPrompt
        showGeoBlocked={false}
        isCanonical={false}
        {...lessonMediaClipsFixtures()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Sign in to continue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our content remains 100% free/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/P.S. Signing in also gives you more ways/),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        "An illustration of a hijabi teacher writing on a whiteboard",
      ),
    ).toBeInTheDocument();
  });

  it("renders the geoblocked prompt with non-canonical link when geoblocked and non-canonical lesson", () => {
    setUseUserReturn(mockGeorestrictedUser);

    render(
      <RestrictedContentPrompt
        showGeoBlocked={true}
        isCanonical={false}
        {...lessonMediaClipsFixtures()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Sorry but this content is only available in the UK.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to lesson" }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team",
    );
  });

  it("renders the geoblocked prompt with canonical link when geoblocked and canonical lesson", () => {
    setUseUserReturn(mockGeorestrictedUser);

    render(
      <RestrictedContentPrompt
        showGeoBlocked={true}
        isCanonical={true}
        {...lessonMediaClipsFixtures()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Sorry but this content is only available in the UK.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to lesson" }),
    ).toHaveAttribute("href", "/teachers/lessons/running-as-a-team");
  });
});
