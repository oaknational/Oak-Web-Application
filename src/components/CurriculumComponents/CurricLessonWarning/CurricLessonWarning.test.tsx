import { CurricLessonWarning } from "./";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricLessonWarning", () => {
  test("basic usage", () => {
    const { baseElement } = renderWithTheme(
      <CurricLessonWarning count={4} total={6} />,
    );
    expect(baseElement).toHaveTextContent("4/6 lessons");
    expect(baseElement).toMatchSnapshot();
  });
});
