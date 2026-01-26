import { act } from "@testing-library/react";

import { ProgrammeOverview } from "./ProgrammeOverview";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["theme", "oakTheme", "analytics"]);

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

Element.prototype.checkVisibility = jest.fn(() => true) as jest.Mock;
Element.prototype.scrollIntoView = jest.fn(() => {}) as jest.Mock;

describe("ProgrammeOverview", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the overview tab", () => {
    const { getByRole } = render(
      <ProgrammeOverview {...curriculumOverviewTabFixture()} />,
    );
    const link = getByRole("link", { name: "Aims and purpose" });

    act(() => {
      link.click();
    });

    expect(mockPush).toHaveBeenCalledWith("#header-aims-and-purpose");
  });
});
