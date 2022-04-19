import { render } from "@testing-library/react";

import VisuallyHidden from "./VisuallyHidden";

it("renders <VisuallyHidden> unchanged", () => {
  const { container } = render(<VisuallyHidden>Some text</VisuallyHidden>);
  expect(container).toMatchSnapshot();
});
