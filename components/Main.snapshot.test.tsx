import { render } from "@testing-library/react";
import Main from "./Main";

import styles from "../styles/Home.module.css";

it("renders homepage unchanged", () => {
  const { container } = render(<Main styles={styles} />);
  expect(container).toMatchSnapshot();
});
