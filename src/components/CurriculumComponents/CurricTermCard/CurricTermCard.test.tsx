import { OakBox } from "@oaknational/oak-components";

import { CurricTermCard } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricTermCard", () => {
  test("snapshot", () => {
    const { baseElement, getByTestId } = render(
      <CurricTermCard
        title={"Yeat 1"}
        coveredNumberOfLessons={25}
        totalNumberOfLessons={30}
      >
        <OakBox data-testid="content">TESTING</OakBox>
      </CurricTermCard>,
    );
    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toHaveTextContent(`25/30 lessons scheduled`);
    expect(getByTestId("content")).toBeDefined();
  });
});
