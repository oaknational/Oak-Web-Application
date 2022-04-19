import { render } from "@testing-library/react";

import Typography from "./Typography";

it("renders <Typography> unchanged", () => {
  const { container } = render(
    <Typography semanticVariant="h2">lesson content</Typography>
  );
  expect(container).toMatchSnapshot();
});
