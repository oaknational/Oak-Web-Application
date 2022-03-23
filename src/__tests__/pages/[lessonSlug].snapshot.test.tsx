import { render } from "@testing-library/react";

import LessonPage from "../../pages/lessons/[lessonSlug]";

it("renders homepage unchanged", () => {
  const { container } = render(<LessonPage />);
  expect(container).toMatchSnapshot();
});
