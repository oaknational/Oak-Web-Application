import { render } from "@testing-library/react";

import Card from "./Card";

it("renders <Card> unchanged", () => {
  const { container } = render(<Card>lesson content</Card>);
  expect(container).toMatchSnapshot();
});
