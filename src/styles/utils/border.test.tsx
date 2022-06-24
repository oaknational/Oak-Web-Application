import styled from "styled-components";
import { render } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import { border } from "./border";

describe("border", () => {
  test("should correctly handle prop 'ba'", async () => {
    const StyledComponent = styled.div`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" ba={12} />
    );

    expect(getByTestId("test")).toHaveStyle("border-left: 12px solid");
    expect(getByTestId("test")).toHaveStyle("border-top: 12px solid");
    expect(getByTestId("test")).toHaveStyle("border-bottom: 12px solid");
    expect(getByTestId("test")).toHaveStyle("border-right: 12px solid");
  });
  test("should correctly handle prop 'bv'", async () => {
    const StyledComponent = styled.div`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" bv={12} />
    );

    expect(getByTestId("test")).toHaveStyle("border-top: 12px solid");
    expect(getByTestId("test")).toHaveStyle("border-bottom: 12px solid");
  });
  test("should correctly handle prop 'bh'", async () => {
    const StyledComponent = styled.div`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" bh={12} />
    );

    expect(getByTestId("test")).toHaveStyle("border-left: 12px solid");
    expect(getByTestId("test")).toHaveStyle("border-right: 12px solid");
  });

  test.each([
    ["bl", "1px", "border-left: 1px solid"],
    ["br", "1px", "border-right: 1px solid"],
    ["bt", "1em", "border-top: 1em solid"],
    ["bb", "1px", "border-bottom: 1px solid"],
  ])("should correctly handle prop '%s'", (prop, value, expected) => {
    const props = {
      [prop]: value,
    };

    const StyledComponent = styled.div`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" {...props} />
    );

    expect(getByTestId("test")).toHaveStyle(expected);
  });
  test("should correctly handle prop 'borderColor'", async () => {
    const StyledComponent = styled.div`
      ${border}
    `;
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" borderColor={"grey3"} />
    );

    expect(getByTestId("test")).toHaveStyle("border-color: #ccc");
  });
  test("should correctly handle prop 'borderRadius'", async () => {
    const StyledComponent = styled.div`
      ${border}
    `;
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" borderRadius={36} />
    );

    expect(getByTestId("test")).toHaveStyle("border-radius: 36px");
  });
  // test("should correctly handle prop 'borderStyle'", async () => {
  //   const StyledComponent = styled.div`
  //     ${border}
  //   `;
  //   const { getByTestId } = renderWithProviders(
  //     <StyledComponent data-testid="test" borderStyle={"dashed"} />
  //   );

  //   expect(getByTestId("test")).toHaveStyle("border-style: dashed");
  // });
});
