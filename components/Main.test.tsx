import { render, screen } from "@testing-library/react";
import Main from "./Main";

import styles from "../styles/Home.module.css";

describe("Main", () => {
  it("renders a heading", () => {
    render(<Main styles={styles} />);

    const heading = screen.getByRole("heading", {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
