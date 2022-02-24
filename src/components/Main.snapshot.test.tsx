import { render } from "@testing-library/react";

import styles from "../styles/Home.module.css";
import Main from "./Main";

it("renders homepage unchanged", () => {
  const { container } = render(<Main styles={styles} />);
  expect(container).toMatchSnapshot();
});
