import { OakBox } from "@oaknational/oak-components";

import { CurricTermCard } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricTermCard", () => {
  test("snapshot", () => {
    const { baseElement, getByTestId } = renderWithTheme(
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
