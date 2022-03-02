import { render } from "@testing-library/react";

import Main from "./Main";

it("renders <Main> unchanged", () => {
  const { container } = render(<Main />);
  expect(container).toMatchSnapshot();
});
