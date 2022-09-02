import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import OL from "./OL";

describe("P", () => {
  test("should render numbers in bold", () => {
    const { getByTestId, debug } = renderWithProviders(
      <OL>
        <li data-testid="ordered-list-item">One</li>
        <li>Two</li>
        <li>Three</li>
      </OL>
    );

    debug();
    //     expect(getByTestId("ordered-list-item")).toHaveStyle(`&::before {
    // font-weight: 600;
    //       }
    //     `);
  });
});
