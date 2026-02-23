import React from "react";

import { NewGutterMaxWidth } from "./index";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("NewGutterMaxWidth", () => {
  it("renders children correctly", () => {
    const { getByText } = renderWithTheme(
      <NewGutterMaxWidth>
        <div>Test content</div>
      </NewGutterMaxWidth>,
    );

    expect(getByText("Test content")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = renderWithTheme(
      <NewGutterMaxWidth>
        <div>Test content</div>
      </NewGutterMaxWidth>,
    );

    expect(container).toMatchSnapshot();
  });
});
