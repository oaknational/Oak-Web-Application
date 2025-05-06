import { CurricVisualiserLayout } from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
const render = renderWithProviders();

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
      />,
    );

    expect(getByTestId("filters")).not.toBeVisible();
    expect(getByTestId("units")).toBeVisible();
  });
});
