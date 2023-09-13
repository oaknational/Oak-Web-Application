import React, { useState } from "react";
import { fireEvent} from "@testing-library/react";

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
  it("should receive and correctly use the setCurrent prop", () => {
    const Wrapper = () => {
      const [current, setCurrent] = useState("teachers");
      return <HomePageTabImageNav current={current} setCurrent={setCurrent} />;
    };

    const { getByTitle, getAllByTestId } = renderWithTheme(<Wrapper />);
    fireEvent.click(getByTitle("Curriculum plans"));
    expect(getAllByTestId("Curriculum plans underline")[0]).toBeInTheDocument();
    fireEvent.click(getByTitle("Pupils"));
    expect(getAllByTestId("Pupils underline")[0]).toBeInTheDocument();
  });
});
