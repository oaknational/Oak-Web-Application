import React from "react";

import { InnerMaxWidth } from "./index";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("InnerMaxWidth", () => {
  it("renders children correctly", () => {
    const { getByText } = renderWithTheme(
      <InnerMaxWidth>
        <div>Test content</div>
      </InnerMaxWidth>,
    );

    expect(getByText("Test content")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <InnerMaxWidth>
        <div>Test content</div>
      </InnerMaxWidth>,
    );

    expect(container).toMatchSnapshot();
  });
});
