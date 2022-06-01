import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders an checkbox", () => {
    renderWithProviders(
      <Checkbox
        id="unique-123"
        checked
        onChange={() => {
          console.log("on change");
        }}
      />
    );

    const input = screen.getByRole("checkbox");

    expect(input).toBeInTheDocument();
  });

  it("renders a label", () => {
    renderWithProviders(
      <Checkbox
        id="unique-123"
        checked
        labelText="Agree to terms"
        onChange={() => {
          console.log("on change");
        }}
      />
    );

    const label = screen.getByText("Agree to terms");

    expect(label).toBeInTheDocument();
  });

  //   it("it changes on click", () => {
  //     renderWithProviders(
  //       <Checkbox
  //         id="unique-123"
  //         checked
  //         onChange={() => {
  //           console.log("on change");
  //         }}
  //       />
  //     );
  //   });
});
