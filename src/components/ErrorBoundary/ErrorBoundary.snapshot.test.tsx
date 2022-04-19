import { render } from "@testing-library/react";

import ErrorBoundary from "./ErrorBoundary";

it("renders <ErrorBoundary> unchanged", () => {
  const { container } = render(<ErrorBoundary>Contents</ErrorBoundary>);
  expect(container).toMatchSnapshot();
});
