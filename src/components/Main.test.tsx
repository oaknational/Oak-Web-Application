import { render, screen } from "@testing-library/react";

import Main from "./Main";

describe("Main", () => {
  it("renders a heading", () => {
    render(<Main />);

    const heading = screen.getByRole("heading", {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
