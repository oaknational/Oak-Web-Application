import { act } from "@testing-library/react";

import { ProgrammeOverview } from "./ProgrammeOverview";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: jest.fn(),
}));

Element.prototype.checkVisibility = jest.fn(() => true) as jest.Mock;
Element.prototype.scrollIntoView = jest.fn(() => {}) as jest.Mock;

const defaultProps = curriculumOverviewTabFixture();

const renderProgrammeOverview = (
  props?: Partial<{ curriculumCMSInfo: CurriculumOverviewSanityData }>,
) => {
  return renderWithProviders()(
    <ProgrammeOverview {...defaultProps} {...props} />,
  );
};

describe("ProgrammeOverview", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders the overview tab", () => {
    const { getByRole } = renderProgrammeOverview();
    const link = getByRole("link", { name: "Aims and purpose" });

    act(() => {
      link.click();
    });

    expect(mockReplace).toHaveBeenCalledWith("#header-aims-and-purpose");
  });
});
