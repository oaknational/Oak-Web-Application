import { CurricLessonWarning } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricLessonWarning", () => {
  test("basic usage", () => {
    const { baseElement } = render(<CurricLessonWarning count={4} total={6} />);
    expect(baseElement).toHaveTextContent("4/6 lessons");
    expect(baseElement).toMatchSnapshot();
  });
});
