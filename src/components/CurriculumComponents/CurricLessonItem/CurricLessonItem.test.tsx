import { CurricLessonItem } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricLessonItem", () => {
  test("with href", () => {
    const { getByTestId, getByRole } = renderWithTheme(
      <CurricLessonItem
        number={1}
        title={"Scotland, England and Robert the Bruce"}
        href={"#TEST"}
      />,
    );
    expect(getByTestId("curric-lesson-item-number")).toHaveTextContent("1");
    expect(getByTestId("curric-lesson-title")).toHaveTextContent(
      "Scotland, England and Robert the Bruce",
    );
    const linkEl = getByRole("link");
    expect(linkEl.getAttribute("href")).toEqual("#TEST");
    expect(linkEl).toHaveTextContent("Go to lesson");
  });

  test("without href", () => {
    const { getByTestId, queryAllByRole } = renderWithTheme(
      <CurricLessonItem
        number={1}
        title={"Scotland, England and Robert the Bruce"}
      />,
    );
    expect(getByTestId("curric-lesson-item-number")).toHaveTextContent("1");
    expect(getByTestId("curric-lesson-title")).toHaveTextContent(
      "Scotland, England and Robert the Bruce",
    );
    const linkEls = queryAllByRole("link");
    expect(linkEls.length).toEqual(0);
  });
});
