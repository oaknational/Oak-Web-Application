import Home from "../../pages/index";
import renderWithProviders from "../__helpers__/renderWithProviders";

const testLesson = { id: 1, title: "Physics only review", slug: "lesson-slug" };

describe("pages/index.tsx", () => {
  it("renders homepage unchanged", () => {
    const { container } = renderWithProviders(<Home lesson={testLesson} />);
    expect(container).toMatchSnapshot();
  });
});
