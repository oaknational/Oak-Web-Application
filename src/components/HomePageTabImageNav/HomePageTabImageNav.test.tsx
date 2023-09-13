import React from "react";

import HomePageTabImageNav from "./HomePageTabImageNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HomePageTabImageNav Component", () => {
  test("renders without errors", () => {
    const { container } = renderWithTheme(
      <HomePageTabImageNav current="" setCurrent={() => {}} />,
    );
    expect(container).toBeTruthy();
  });
  test("receives and handles props correctly", () => {
    const setCurrent = jest.fn();
    const { getAllByText } = renderWithTheme(
      <HomePageTabImageNav current="teachers" setCurrent={setCurrent} />,
    );
    expect(getAllByText("Curriculum plans")[0]).toBeInTheDocument();
  });
});
