import styled from "styled-components";
import { render } from "@testing-library/react";

import { heading, text } from "./typography";

describe("typography", () => {
  test("heading should render correct font", async () => {
    const StyledComponent = styled.div`
      ${heading}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" size={5} />
    );

    expect(getByTestId("test")).toHaveStyle("font-family: Lexend,sans-serif");
  });
  test("body should render correct font", async () => {
    const StyledComponent = styled.div`
      ${text}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" size={1} />
    );

    expect(getByTestId("test")).toHaveStyle("font-family: ABeeZee,sans-serif");
  });
});
