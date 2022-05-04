import { render } from "@testing-library/react";

import Button from "./Button";

it("renders <Button> unchanged", () => {
  const { container } = render(
    <Button href="/" label="Download" icon="Download">
      Download
    </Button>
  );
  expect(container).toMatchSnapshot();
});
