import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonHelper from "./LessonHelper";

describe("LessonHelper", () => {
  it("renders a LessonHelper", () => {
    renderWithTheme(
      <LessonHelper
        helperTitle={"equipment-required"}
        helperIcon={"equipment-required"}
        supervisionLevel={"supervisionLevel"}
      />
    );

    const heading = screen.getByRole("heading", { level: 3 });

    expect(heading).toHaveTextContent("equipment-required");
  });
  it("render null when there is no equipment description", () => {
    const { container } = renderWithTheme(
      <LessonHelper
        helperTitle={"equipment-required"}
        helperIcon={"equipment-required"}
        equipment={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
