import { screen } from "@testing-library/dom";

import { LessonMediaAttributions } from "./LessonMediaAttributions";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockFeatureFlagEnabled = jest.fn().mockReturnValue(false);
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
}));
const render = renderWithProviders();
describe("lesson media attributions", () => {
  it("does not render when the feature flag is disabled", () => {
    render(
      <LessonMediaAttributions
        mediaClipsWithAttributions={[
          { name: "clip 1", attribution: "provided by jest" },
        ]}
      />,
    );

    const attributions = screen.queryByTestId("media-attributions");
    expect(attributions).not.toBeInTheDocument();

    const clipAttribution = screen.queryByText("clip 1");
    expect(clipAttribution).not.toBeInTheDocument();
  });
  it("does not render when there are no media clips", () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    render(<LessonMediaAttributions mediaClipsWithAttributions={[]} />);
    const attributions = screen.queryByTestId("media-attributions");
    expect(attributions).not.toBeInTheDocument();
  });
  it("renders media clips with attributions", () => {
    render(
      <LessonMediaAttributions
        mediaClipsWithAttributions={[
          { name: "clip 1", attribution: "provided by jest" },
          { name: "clip 2", attribution: "provided by oak" },
        ]}
      />,
    );
    const attributions = screen.getByTestId("media-attributions");
    expect(attributions).toBeInTheDocument();
    const clipAttribution1 = screen.getByText("clip 1");
    expect(clipAttribution1).toBeInTheDocument();
    const clipAttribution2 = screen.getByText("clip 2");
    expect(clipAttribution2).toBeInTheDocument();
  });
  it('prefixes attribution with "©"', () => {
    render(
      <LessonMediaAttributions
        mediaClipsWithAttributions={[
          { name: "clip 1", attribution: "provided by jest" },
        ]}
      />,
    );
    const clipAttribution = screen.getByText("© provided by jest", {
      exact: false,
    });
    expect(clipAttribution).toHaveTextContent("© provided by jest");
  });
});
