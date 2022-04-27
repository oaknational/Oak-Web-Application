import LessonPage from "../../pages/lessons/[lessonSlug]";
import renderWithProviders from "../__helpers__/renderWithProviders";

it("renders homepage unchanged", () => {
  const { container } = renderWithProviders(
    <LessonPage
      lesson={{ id: "1", slug: "test-lesson", title: "Test lesson" }}
    />
  );
  expect(container).toMatchSnapshot();
});
