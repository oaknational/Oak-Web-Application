import { render } from "@testing-library/react";

import Layout from "./Layout";

it("renders <Layout> unchanged", () => {
  const { container } = render(<Layout />);
  expect(container).toMatchSnapshot();
});
