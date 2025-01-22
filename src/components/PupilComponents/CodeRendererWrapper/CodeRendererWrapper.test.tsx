import React from "react";
import "@testing-library/jest-dom";

import { CodeRenderWrapper } from "./CodeRendererWrapper";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

it("should render OakCodeRenderer if children is a string", () => {
  const { getByText } = renderWithTheme(
    <CodeRenderWrapper>none code string</CodeRenderWrapper>,
  );
  const codeRenderer = getByText("none code string");

  expect(codeRenderer).toBeInTheDocument();
});
it("should render OakCodeRenderer if the child has an element with string as a child", () => {
  const { getByText } = renderWithTheme(
    <CodeRenderWrapper>
      <div>none code string</div>
    </CodeRenderWrapper>,
  );
  const codeRenderer = getByText("none code string");

  expect(codeRenderer).toBeInTheDocument();
});
it("should just return the child if the child is not a string and that child has no chidren", () => {
  const { getByDisplayValue } = renderWithTheme(
    <CodeRenderWrapper>
      <input type="text" defaultValue={"input"} />
    </CodeRenderWrapper>,
  );

  const input = getByDisplayValue("input");

  expect(input).toBeInTheDocument();
});
