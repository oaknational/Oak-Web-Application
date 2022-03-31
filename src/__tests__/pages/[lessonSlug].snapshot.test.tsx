import { render } from "@testing-library/react";

import LessonPage from "../../pages/lessons/[lessonSlug]";

it("renders homepage unchanged", () => {
  const { container } = render(
    <LessonPage lesson={{ id: 1, slug: "test-lesson", title: "Test lesson" }} />
  );
  expect(container).toMatchSnapshot();
});
