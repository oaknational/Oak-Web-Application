import { CurricVisualiserLayout } from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
const render = renderWithProviders();

jest.mock("@/hooks/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(true),
}));

const mockProps = {
  slugs: {
    subjectSlug: "maths",
    phaseSlug: "primary",
    ks4OptionSlug: null,
  },
  curriculumPhaseOptions: {
    subjects: [
      {
        slug: "maths",
        title: "Maths",
        phases: [
          {
            slug: "primary",
            title: "Primary",
          },
        ],
        ks4_options: null,
      },
    ],
  },
  keyStages: ["ks1", "ks2"],
};

describe("CurricVisualiserLayout", () => {
  // it("large screen", () => {
  //     const {getByTestId} = render(
  //         <CurricVisualiserLayout
  //             filters={<div data-testid="filters">filters</div>}
  //             units={<div data-testid="units">units</div>}
  //         />
  //     )

  //     expect(getByTestId("filters")).toBeVisible();
  //     expect(getByTestId("units")).toBeVisible();
  // });

  it("small screen", () => {
    const { getByTestId } = render(
      <CurricVisualiserLayout
        filters={<div data-testid="filters">filters</div>}
        units={<div data-testid="units">units</div>}
        {...mockProps}
      />,
    );

    expect(getByTestId("filters")).not.toBeVisible();
    expect(getByTestId("units")).toBeVisible();
  });
});
