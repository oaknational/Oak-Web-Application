import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonHelper from "./LessonHelper";

describe("LessonHelper", () => {
  it("renders a LessonHelper", () => {
    renderWithTheme(
      <LessonHelper
        helperTitle={"EquipmentRequired"}
        helperIcon={"EquipmentRequired"}
        helperDescription={"equipment description"}
      />
    );

    const heading = screen.getByRole("heading", { level: 3 });

    expect(heading).toHaveTextContent("EquipmentRequired");
  });
  it("render null when there is no equipment description", () => {
    const { container } = renderWithTheme(
      <LessonHelper
        helperTitle={"EquipmentRequired"}
        helperIcon={"EquipmentRequired"}
        helperDescription={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
