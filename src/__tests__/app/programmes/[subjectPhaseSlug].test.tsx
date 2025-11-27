import { screen } from "@testing-library/dom";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import ProgrammePage from "@/app/(core)/programmes/[subjectPhaseSlug]/page";

const featureFlagMock = jest.fn().mockResolvedValue(false);
jest.mock("@/utils/featureFlags", () => ({
  useFeatureFlag: () => featureFlagMock(),
}));

describe("Programme page", () => {
  it("renders 404 page if feature flag is disabled", async () => {
    expect(async () =>
      renderWithTheme(
        await ProgrammePage({
          params: Promise.resolve({ subjectPhaseSlug: "art-primary" }),
        }),
      ),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
  it("renders when the feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);
    renderWithTheme(
      await ProgrammePage({
        params: Promise.resolve({ subjectPhaseSlug: "art-primary" }),
      }),
    );

    const title = screen.getByText("art-primary");
    expect(title).toBeInTheDocument();
  });
});
