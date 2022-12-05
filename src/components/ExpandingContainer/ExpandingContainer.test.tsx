import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import Card from "../Card";

import ExpandingContainer from ".";

it("component renders with the title", () => {
  renderWithTheme(
    <ExpandingContainer
      external={true}
      projectable={true}
      downloadable={true}
      title={"Video"}
    >
      <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
        Grid box
      </Card>
    </ExpandingContainer>
  );
});
test.todo("renders top right icons");
test.todo("component expands and contract on click");
